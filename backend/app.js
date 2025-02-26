const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const createError = require("http-errors"); // Import createError

// Import routes
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const collaborationRouter = require("./routes/collaborationRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const messageRouter = require("./routes/messageRoutes");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use environment variable
    credentials: true,
  })
);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to database
require("./config/db");

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Register routes with /api prefix
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/collaborations", collaborationRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/messages", messageRouter);

// Define a route for the root (/) that returns a simple message or redirects
app.get("/", (req, res) => {
  res.send("Welcome to the Collabix API!");  // You can change this to render an HTML page or redirect
});

// Serve the favicon (Optional)
app.get("/favicon.ico", (req, res) => res.status(204));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404)); // Properly create a 404 error
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
