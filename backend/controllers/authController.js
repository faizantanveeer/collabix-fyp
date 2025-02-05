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
      return res.status(400).send("Incorrect Email/Password!");
    }

    const token = jwt.sign({ email: loginUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    
    return res.json({ token});  // Send the token back to the frontend as JSON

  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};



const signupHandler = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const createdUser = await new userModel({
          name,
          email,
          password: hash,
          role,
        });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        console.log(token);

        await createdUser.save();

        res.cookie("token", token);

        res.send("Successfully Created User");
      });
    });
  } catch (err) {
    console.log(err);
  }
};

const logoutHandler = (req, res) => {
  res.cookie("authToken", "");
  res.redirect("http://localhost:3000/");
};

module.exports = { loginHandler, signupHandler, logoutHandler };
