const express = require("express");
const authenticateUser = require("../middleware/isLoggedIn");
const router = express.Router();

// Import route handlers
const authRouter = require("./auth");
const userRoutes = require("./user");
const { dashboardHandler } = require("../controllers/dashboardController");

// Home route
router.get("/", (req, res) => {
  res.render("index", { title: "Collabix" });
});

// Home page route
router.get("/home", (req, res) => {
  res.render("home.ejs");
});

// Dashboard route (protected by authentication)
router.get("/dashboard", authenticateUser, dashboardHandler);

// Authentication routes
router.use("/auth", authRouter);

// User-related routes
router.use("/user", authenticateUser, userRoutes);

module.exports = router;