const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const Project = require("../models/Project");
const Task = require("../models/Task");
const projectRouter = express.Router();

// Protects all rotes in this router
projectRouter.use(authMiddleware);

/**
 * GET /api/projects
 */
projectRouter.get("/", async (req, res) => {
  try {
    const userProjects = await Project.find({ user: req.user._id });

    res.json(userProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/projects/:projectId
 */
projectRouter.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res
        .status(404)
        .json({ message: `Project with id: ${projectId} not found!` });
    }

    // Authorization
    console.log(req.user._id);
    console.log(project.user);

    if (project.user.toString() !== req.user._id) {
      return res.status(403).json({ message: "User is not authorized!" });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/projects
 */
projectRouter.post("/", async (req, res) => {
  try {
    const newProject = await Project.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/projects/projectId
 */
projectRouter.put("/:projectId", async (req, res) => {
  res.send("update project....");
});

/**
 * DELETE /api/projects/projectId
 */
projectRouter.delete("/:projectId", async (req, res) => {
  res.send("delete project....");
});

/**
 * Create a new task
 * POST /api/projects/:projectId/tasks
 */
projectRouter.post("/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) return res.json({ message: "project not found" });

    // check for ownership, if exist
    if (req.user._id.toString() !== project.user.toString()) {
      return res.json({ message: "User not allowed to create task." });
    }

    const newTask = await Task.create({
      ...req.body,
      project: projectId,
    });

    console.log(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all tasks for a specific project
 * GET /api/projects/:projectId/tasks
 */
projectRouter.get("/:projectId/tasks", async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found!" });
    }

    // check for ownership, if exist
    if (req.user._id.toString() !== project.user.toString()) {
      return res.json({ message: "User not allowed to access task." });
    }

    const tasks = await Task.find({ project: projectId });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = projectRouter;
