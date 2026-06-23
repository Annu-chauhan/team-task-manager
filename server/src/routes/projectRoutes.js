const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getProjects,
  addProjectMember,
} = require("../controllers/projectControllers");

// GET ALL PROJECTS & CREATE PROJECT
router.route("/")
  .get(protect, getProjects)
  .post(protect, createProject);

// ADD A MEMBER TO A PROJECT
router.post("/:id/members", protect, addProjectMember);

module.exports = router;