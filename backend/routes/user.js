const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  updatePaymentMethods,
  deleteUserAccount, // Ensure this is imported
} = require("../controllers/userController");
const isLoggedIn = require("../middleware/isLoggedIn");

// Get user profile
router.get("/profile", isLoggedIn, getUserProfile);

// Update user profile
router.put("/profile", isLoggedIn, updateProfile);

// Update payment methods
router.put("/payment-methods", isLoggedIn, updatePaymentMethods);

// Delete user account
router.delete("/delete", isLoggedIn, deleteUserAccount); // Ensure this is defined

module.exports = router;