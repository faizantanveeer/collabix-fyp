const Gig = require('../models/gig_model');
const User = require('../models/user_model');

// ✅ Create a new gig
const createGig = async (req, res) => {
	try {
		console.log('REQ BODY:', req.body); // text fields
		console.log('FILES:', req.files); // uploaded images

		const { title, description, price, deliveryTime, revisions, category } =
			req.body;

		// Parse numbers correctly (since formData sends them as strings)
		const gig = new Gig({
			influencer: req.user._id,
			title,
			description,
			price: Number(price),
			deliveryTime: Number(deliveryTime),
			revisions: Number(revisions),
			category,
			images: req.files.images?.map((file) => `${file.filename}`),
		});

		await gig.save();
		res.status(201).json({ message: 'Gig created successfully', gig });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Gig creation failed' });
	}
};

// ✅ Get all gigs (for home or explore)
const getAllGigs = async (req, res) => {
	try {
		const gigs = await Gig.find({ isActive: true }).populate(
			'influencer',
			'name profileImage'
		);
		res.json(gigs);
	} catch (error) {
		console.error('Get All Gigs Error:', error);
		res.status(500).json({ message: 'Error fetching gigs' });
	}
};

// ✅ Get gigs for specific influencer
const getInfluencerGigsbyId = async (req, res) => {
	try {
		const { id } = req.params;
		const gigs = await Gig.find({ influencer: id });
		res.json(gigs);
	} catch (error) {
		console.error('Get Influencer Gigs Error:', error);
		res.status(500).json({ message: "Error fetching influencer's gigs" });
	}
};

const getInfluencerGigs = async (req, res) => {
	try {
		if (!req.user || !req.user.email) {
			return res.status(401).json({ message: 'Unauthorized access' });
		}
		console.log('Fetching gigs for user:', req.user.email);

		const user = await User.findOne({ email: req.user.email });

		if (!user) {
			return res.status(404).json({ message: 'User profile not found' });
		}

		console.log('User found:', user);

		const userId = user._id;
		const gigs = await Gig.find({ influencer: userId }).sort({
			createdAt: -1,
		});

		res.status(200).json({ gigs });
	} catch (err) {
		console.error('Error fetching influencer gigs:', err);
		res.status(500).json({ error: 'Server Error' });
	}
};

module.exports = {
	createGig,
	getAllGigs,
	getInfluencerGigs,
	getInfluencerGigsbyId,
};
