const express = require("express");
const {isLoggedIn} = require("../middleware/isLoggedIn");
const router = express.Router();

// Import route handlers
const authRouter = require("./auth");
const userRoutes = require("./user");
const { dashboardHandler } = require("../controllers/dashboardController");
const influencerRoutes = require("./influencer")
const collaborationRoutes = require('./collaboration')



// Home route
router.get("/", (req, res) => {
  res.render("index", { title: "Collabix" });
});

// Home page route
router.get("/home", (req, res) => {
  res.render("home.ejs");
});

// Dashboard route (protected by authentication)
router.get("/dashboard", isLoggedIn, dashboardHandler);

// Authentication routes
router.use("/auth", authRouter);

router.use("/influencers", influencerRoutes);

// User-related routes
router.use("/user", isLoggedIn, userRoutes);

router.use('/collaboration', collaborationRoutes)


module.exports = router;