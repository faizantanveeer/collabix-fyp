var express = require("express");
var router = express.Router();
const userModel = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const signupHandler = async (req, res) => {
  const { name, email, password, role, influencerDetails, businessDetails } =
    req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "influencer" && { influencerDetails }),
      ...(role === "business" && { businessDetails }),
    });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });
    res.cookie("token", token);

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = signupHandler;

const logoutHandler = (req, res) => {
  res.cookie("token", "");
  res.redirect("http://localhost:3000/");
};

module.exports = { loginHandler, signupHandler, logoutHandler };
