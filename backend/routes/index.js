const express = require("express");
const {isLoggedIn} = require("../middleware/isLoggedIn");
const router = express.Router();

// Import route handlers
const authRoutes = require('./auth');
const collaborationRoutes = require('./collaboration');
const userRoutes = require('./user');
const { dashboardHandler } = require("../controllers/dashboardController");
const influencerRoutes = require("./influencer")
const chatbotRoutes = require('./chatbot')



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
router.use('/auth', authRoutes);

router.use("/influencers", influencerRoutes);

// User-related routes
router.use('/user', userRoutes);

router.use('/collaboration', collaborationRoutes)

router.use('/chatbot', chatbotRoutes)

module.exports = router;