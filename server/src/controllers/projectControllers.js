const Project = require("../models/Project");

// CREATE PROJECT
const createProject = async (req, res) => {

  try {

    const {
      title,
      description,
      members,
    } = req.body;

    const project = await Project.create({
      title,
      description,
      admin: req.user._id,
      members,
    });

    res.status(201).json(project);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET PROJECTS
const getProjects = async (req, res) => {

  try {

    const projects = await Project.find()
      .populate("admin", "name email")
      .populate("members", "name email");

    res.json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
};