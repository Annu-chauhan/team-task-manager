const express = require("express");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE TASK
router.post(
  "/",
  protect,
  createTask
);

// GET TASKS
router.get(
  "/",
  protect,
  getTasks
);

// UPDATE TASK
router.put(
  "/:id",
  protect,
  updateTaskStatus
);

module.exports = router;