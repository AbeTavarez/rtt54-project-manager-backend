const express = require("express");
const { authMiddleware } = require("../middlewares/auth");
const Project = require("../models/Project");
const Task = require("../models/Task");
const taskRouter = express.Router();

// Protects all rotes in this router
taskRouter.use(authMiddleware);

/**
 * Update a single task.
 * PUT /api/tasks/:taskId
 */
taskRouter.put("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task by :taskId.
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    // From the task, find its parent project.
    const project = await Project.findById(task.project);

    // check for ownership, if exist
    if (req.user._id.toString() !== project.user.toString()) {
      return res.json({ message: "User not allowed to access task." });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });

    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});



/**
 * Delete a single task.
 * DELETE /api/tasks/:taskId
 */
taskRouter.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task by :taskId.
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    // From the task, find its parent project.
    const project = await Project.findById(task.project);

    // check for ownership, if exist
    if (req.user._id.toString() !== project.user.toString()) {
      return res.json({ message: "User not allowed to access task." });
    }

    const deletedTask = await Task.findByIdAndDelete(taskId);

    res.json(deletedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * Get a single task.
 * GET /api/tasks/:taskId
 */
taskRouter.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find the task by :taskId.
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found!" });
    }

    // From the task, find its parent project.
    const project = await Project.findById(task.project);

    // check for ownership, if exist
    if (req.user._id.toString() !== project.user.toString()) {
      return res.json({ message: "User not allowed to access task." });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = taskRouter;