// Import necessary modules
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config({ path: '../.env' });

// Check required environment variables
const requiredEnvVars = ["USER_SERVICE_PORT", "ACCESS_TOKEN_SECRET", "REFRESH_TOKEN_SECRET", "ALLOWED_ORIGINS"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

// Import routes
const authenticateToken = require("./middleware/authenticateToken");
const userRoutes = require("./routes/userRoute");
const authRoutes = require("./routes/authRoute");
const refreshTokenRoutes = require("./routes/refreshTokenRoutes");
const registerRoutes = require("./routes/registerRoutes");

// Initialize express app
const app = express();

// Apply security-related middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    referrerPolicy: { policy: "no-referrer" },
    crossOriginEmbedderPolicy: false,
  })
);

// Configure CORS
const corsOptionsDelegate = (req, callback) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : [];
  const corsOptions = !req.header("Origin") || allowedOrigins.includes(req.header("Origin"))
    ? { origin: true, credentials: true }
    : { origin: false };
  callback(null, corsOptions);
};
app.use(cors(corsOptionsDelegate));

// Apply parsing and logging middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Apply rate limiting
app.use("/v1/auth/login", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts from this IP, please try again after 15 minutes.",
  handler: (req, res) => res.status(429).json({ message: "Too many requests, please try again later." })
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes."
}));

// Health check route
app.get("/health", (req, res) => res.status(200).json({ status: "ok", uptime: process.uptime() }));

// Register routes
app.use("/v1/users", userRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/refresh-tokens", refreshTokenRoutes);
app.use("/v1/register", registerRoutes);

// Root route
app.get("/", (req, res) => res.status(200).send("Service is running"));

// 404 error handler
app.use((req, res) => res.status(404).json({ message: "Resource not found" }));

// General error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.statusCode || 500).json({
    message: err.statusCode === 500 ? "Internal Server Error" : err.message || "An error occurred",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Start the server
const PORT = process.env.USER_SERVICE_PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Error handling for server and unhandled rejections
server.on("error", err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
process.on("unhandledRejection", reason => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});
process.on("uncaughtException", error => {
  console.error("Uncaught Exception:", error);
  server.close(() => process.exit(1));
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
