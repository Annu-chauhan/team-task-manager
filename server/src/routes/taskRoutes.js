const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controllers/taskController");

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