const express = require("express");

const {
  signup,
  login,
} = require("../controllers/authControllers");

const {
  validateSignup,
  validateLogin,
} = require("../middleware/validation");

const router = express.Router();

// SIGNUP
router.post("/signup", validateSignup, signup);

// LOGIN
router.post("/login", validateLogin, login);

module.exports = router;