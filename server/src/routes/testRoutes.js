const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();


// Protected Route
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});


// Admin Only Route
router.get(
  "/admin",
  protect,
  adminOnly,
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);

module.exports = router;