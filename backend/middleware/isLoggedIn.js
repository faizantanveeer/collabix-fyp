const jwt = require('jsonwebtoken');
const User = require('../models/user_model'); // Adjust the path as needed

const isLoggedIn = (req, res, next) => {
	// Check cookie first
	const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res
			.status(401)
			.json({ message: 'Unauthorized access. No token provided.' });
	}
	console.log('Token received:', token);

	try {
		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET); // Use same secret as NextAuth

		console.log('decoded token:', decoded);

		req.user = decoded;
		next();
	} catch (err) {
		return res.status(403).json({ message: 'Invalid or expired token.' });
	}
};

const businessOnly = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: No token provided' });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
		const userEmail = decoded.email;

		const user = await User.findOne({ email: userEmail });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.role !== 'business') {
			return res.status(403).json({
				message:
					'Access denied: Only businesses can perform this action',
			});
		}

		req.user = user; // attach full user object if needed in routes
		next();
	} catch (error) {
		console.error('Authorization error:', error);
		return res
			.status(500)
			.json({ message: 'Server error during authorization' });
	}
};

const influencerOnly = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Unauthorized: No token provided' });
		}

		const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
		const userEmail = decoded.email;

		const user = await User.findOne({ email: userEmail });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		if (user.role !== 'influencer') {
			return res.status(403).json({
				message:
					'Access denied: Only influencers can perform this action',
			});
		}

		req.user = user; // attach full user object if needed in routes
		next();
	} catch (error) {
		console.error('Authorization error:', error);
		return res
			.status(500)
			.json({ message: 'Server error during authorization' });
	}
};

module.exports = { isLoggedIn, businessOnly, influencerOnly };
