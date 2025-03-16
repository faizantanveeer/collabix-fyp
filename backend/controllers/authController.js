const express = require('express')
const userModel = require("../models/user_model");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// LOGIN HANDLER
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginUser = await userModel.findOne({ email });

    if (!loginUser) {
      return res.status(404).json({ message: "No User Found! Sign Up" });
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Email/Password!" });
    }
    // Generate JWT
    const token = jwt.sign({ email}, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

   // Store token in HTTP-only cookie
   res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",  
    sameSite: "Strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
  // console.log(token)

    return res.json({
      id: loginUser._id,
      email: loginUser.email,
      name: loginUser.name,
      role: loginUser.role,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

// SIGNUP HANDLER
const signupHandler = async (req, res) => {
  const { name, email, password, role, influencerDetails, businessDetails } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Name, email, password, and role are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user with hashed password
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "influencer" && { influencerDetails }),
      ...(role === "business" && { businessDetails }),
    });

    // Save user to database
    const savedUser = await newUser.save();

    // Return success response with user data (excluding password)
    return res.status(201).json({
      message: "User created successfully",
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// LOGOUT HANDLER
const logoutHandler = (req, res) => {
  // Since no token/cookie is being used, we can just send a logout success message
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { loginHandler, signupHandler, logoutHandler };
