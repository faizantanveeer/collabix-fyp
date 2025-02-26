const userModel = require("../models/user_model");

// LOGIN HANDLER
const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const loginUser = await userModel.findOne({ email });
    if (!loginUser) {
      return res.status(404).json({ message: "User not found. Please sign up." });
    }

    // Directly compare passwords
    if (loginUser.password !== password) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    // Return user data directly
    return res.status(200).json({
      id: loginUser._id,
      email: loginUser.email,
      name: loginUser.name,
      role: loginUser.role,
      password: loginUser.password, // Returning the password as is
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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

    // Create new user (store password as plaintext)
    const newUser = new userModel({
      name,
      email,
      password, // Store password as plaintext
      role,
      ...(role === "influencer" && { influencerDetails }),
      ...(role === "business" && { businessDetails }),
    });

    // Save user to database
    await newUser.save();

    // Return success response with user data
    return res.status(201).json({
      message: "User created successfully",
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      password: newUser.password, // Returning the password as is
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
