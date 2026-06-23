// Global centralized error handler
const errorHandler = (err, req, res, next) => {
  console.error("Centralized Error Handler caught:", err.stack || err);

  const statusCode = err.status || res.statusCode || 500;
  const status = statusCode >= 500 ? "error" : "fail";

  res.status(statusCode).json({
    status,
    message: err.message || "Internal Server Error",
    // Only send stack trace in local/development environment
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
