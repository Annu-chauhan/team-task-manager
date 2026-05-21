const express = require("express");

const Project = require("../models/Project");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE PROJECT
router.post("/", protect, async (req, res) => {

  try {

    const {
      title,
      description,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// GET ALL PROJECTS
router.get("/", protect, async (req, res) => {

  try {

    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("members", "name email")
      .populate("admin", "name email");

    res.json(projects);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;