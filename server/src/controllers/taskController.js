const Task = require("../models/Task");
const Project = require("../models/Project");

// CREATE TASK
const createTask = async (req, res, next) => {
  try {
    const { title, description, project } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Task title is required" });
    }

    // If project is specified, verify project exists and user is a member
    if (project) {
      const proj = await Project.findById(project);
      if (!proj) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (!proj.members.includes(req.user._id)) {
        return res.status(403).json({ message: "Not authorized: You are not a member of this project" });
      }
    }

    const task = await Task.create({
      title,
      description,
      user: req.user._id,
      project: project || undefined,
      status: "pending",
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// GET TASKS
const getTasks = async (req, res, next) => {
  try {
    const { project } = req.query;
    let query = { user: req.user._id };

    if (project) {
      const proj = await Project.findById(project);
      if (!proj) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (!proj.members.includes(req.user._id)) {
        return res.status(403).json({ message: "Not authorized: You are not a member of this project" });
      }
      // Return all tasks in this project
      query = { project };
    }

    const tasks = await Task.find(query)
      .populate("user", "name email")
      .populate("project", "title");

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// UPDATE TASK STATUS / CONTENT
const updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Enforce authorization: only the task owner can edit
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized: You do not own this task" });
    }

    const { title, description, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) {
      if (!["pending", "in-progress", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      task.status = status;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// DELETE TASK
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Enforce authorization: only the task owner can delete
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized: You do not own this task" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
};