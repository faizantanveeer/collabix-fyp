const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfileImage,
} = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");
const upload = require("../utils/multer");
const User = require("../models/user_model");

router.post("/profile/upload/:id", upload.single("profileImage"), updateProfileImage);

// Get user profile with stats and social links
router.get("/profile/:id", getUserProfile);



module.exports = router;