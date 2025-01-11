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
      res.send("No User Found! Sign Up");
      return;
    }

    const isMatch = await bcrypt.compare(password, loginUser.password);

    if (!isMatch) {
      res.send("Imcorrect Email/Password!");
      return;
    }

    const token = jwt.sign({ email: loginUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log(res.cookie("token", token));

    return res.send("Authenticate Successfully");
  } catch (error) {
    return res.status(500).send(error);
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
  res.cookie("token", "");
  res.redirect("/");
};

module.exports = { loginHandler, signupHandler, logoutHandler };
