const Project = require("../models/Project");
const User = require("../models/User");

// CREATE PROJECT
const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Project title is required" });
    }

    const project = await Project.create({
      title,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// GET PROJECTS
const getProjects = async (req, res, next) => {
  try {
    // Only return projects where the user is a member or admin
    const projects = await Project.find({
      members: req.user._id,
    })
      .populate("admin", "name email")
      .populate("members", "name email");

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// ADD PROJECT MEMBER (INVITE BY EMAIL)
const addProjectMember = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required to invite a member" });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the admin can add members
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized: Only the project admin can invite members" });
    }

    // Find the user by email
    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
      return res.status(404).json({ message: "User with this email not found" });
    }

    // Check if already a member
    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: "User is already a member of this project" });
    }

    project.members.push(userToAdd._id);
    await project.save();

    // Fetch updated project with populated fields
    const updatedProject = await Project.findById(project._id)
      .populate("admin", "name email")
      .populate("members", "name email");

    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  addProjectMember,
};