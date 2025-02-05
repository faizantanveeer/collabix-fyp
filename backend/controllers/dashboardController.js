var express = require("express");
var router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const userModel = require('../models/user_model'); // Add this import if necessary


const dashboardHandler = async (req, res) => {
  try {
    // Check if req.user is available (this should come from the isLoggedIn middleware)
    if (!req.user) {
      return res.status(400).send('User not authenticated');
    }

    // Fetch the user from the database
    const user = await userModel.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send the user data as response
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      // Add any other data you want to send to the frontend
    });
  } catch (error) {
    // Log the error message and stack trace for debugging
    console.error('Error fetching user data:', error.message);
    console.error(error.stack);
    res.status(500).send('Server error');
  }
};

module.exports = { dashboardHandler };
