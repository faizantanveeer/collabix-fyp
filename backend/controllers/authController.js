const express = require('express');
const userModel = require('../models/user_model');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

// LOGIN HANDLER
const loginHandler = async (req, res) => {
	try {
		const { email, password } = req.body;

		const loginUser = await userModel.findOne({ email });

		if (!loginUser) {
			return res.status(404).json({ message: 'No User Found! Sign Up' });
		}

		const isMatch = await bcrypt.compare(password, loginUser.password);

		if (!isMatch) {
			return res
				.status(400)
				.json({ message: 'Incorrect Email/Password!' });
		}
		// Generate JWT
		const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, {
			expiresIn: '1d',
		});

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
	const { name, email, password, role } = req.body;

	// Validate input
	if (!name || !email || !password || !role) {
		return res
			.status(400)
			.json({ error: 'Name, email, password, and role are required' });
	}

	try {
		// Check if user already exists
		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
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
			...(role === 'influencer' && { influencerDetails: {} }),
			...(role === 'business' && { businessDetails: {} }),
		});

		// Save user to database
		const savedUser = await newUser.save();

		// Generate JWT token
		const token = jwt.sign(
			{
				email: savedUser.email,
			},
			process.env.NEXTAUTH_SECRET, // Should be set in your .env file
			{ expiresIn: '7d' }
		);

		// Return success response with user data (excluding password)
		return res.status(201).json({
			message: 'User created successfully',
			id: savedUser._id,
			email: savedUser.email,
			name: savedUser.name,
			role: savedUser.role,
			token,
		});
	} catch (err) {
		console.error('Signup Error:', err);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
};

const googleLoginHandler = async (req, res) => {
	const { name, email, image, googleId } = req.body;

	console.log(name, email, image, googleId);

	try {
		const user = await userModel.findOne({ email });
		if (!user) {
			const user = new userModel({
				name,
				email,
				profileImage: image,
				googleId,
				isGoogleUser: true, // important!
				role: 'influencer',
			});

			const newUser = await user.save();

			console.log('New User: ', newUser);
			const token = jwt.sign(
				{ id: newUser._id },
				process.env.NEXTAUTH_SECRET
			);

			return res.status(200).json({ user: newUser, token });
		}

		const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET);
		res.status(200).json({ user, token });
	} catch (error) {
		console.error('Google signup error:', error);
		res.status(500).json({ message: 'Internal Server Error' });
	}
};

// LOGOUT HANDLER
const logoutHandler = (req, res) => {
	// Since no token/cookie is being used, we can just send a logout success message
	return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
	loginHandler,
	signupHandler,
	logoutHandler,
	googleLoginHandler,
};
