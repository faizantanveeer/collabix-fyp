const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const isLoggedn = require("../middleware/isLoggedIn"); // ✅ Ensure this is correct

const router = express.Router();

router.get("/profile", isLoggedn, getUserProfile); // ✅ Correct usage

module.exports = router;
