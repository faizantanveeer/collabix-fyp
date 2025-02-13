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
      return res.status(404).json({message: "No User Found! Sign Up"});
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);

    if (!isMatch) {
      return res.status(400).json({message: "Incorrect Email/Password!"});
    }

      res.json({ id: loginUser._id, email: loginUser.email, name: loginUser.name , role: loginUser.role});

  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};



const signupHandler = async (req, res) => {

  const { name, email, password, role, influencerDetails, businessDetails } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      ...(role === "influencer" && { influencerDetails }),
      ...(role === "business" && { businessDetails }),
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = signupHandler;


const logoutHandler = (req, res) => {
  res.cookie("authToken", "");
  res.redirect("http://localhost:3000/");
};

module.exports = { loginHandler, signupHandler, logoutHandler };
