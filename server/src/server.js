require("dotenv").config();

// Ensure critical environment variables exist
if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in the environment variables.");
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// DATABASE CONNECTION
connectDB();

// MIDDLEWARE
app.use(helmet()); // Set security HTTP headers
app.use(morgan("dev")); // HTTP request logger

// CORS configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // Body parser

// Rate limiting: 100 requests per 15 minutes for general API, tighter for auth
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again later." },
});
app.use("/api/", generalLimiter);

// Auth Limiter: 20 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many authentication requests, please try again later." },
});
app.use("/api/auth", authLimiter);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);

const path = require("path");

// Serve static assets in production
app.use(express.static(path.join(__dirname, "../public")));

// CATCH-ALL ROUTE FOR REACT SPA ROUTING
app.get("*", (req, res) => {
  // If request is for an API, return a 404 instead of index.html
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found" });
  }
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});