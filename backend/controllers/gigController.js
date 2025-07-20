const Gig = require('../models/gig_model');

// ✅ Create a new gig
const createGig = async (req, res) => {
	try {
		const { influencer } = req.user; // if using auth middleware
		const {
			title,
			description,
			price,
			deliveryTime,
			revisions,
			images,
			category,
		} = req.body;

		if (!title || !description || !price || !deliveryTime) {
			return res
				.status(400)
				.json({ message: 'All required fields must be filled' });
		}

		const newGig = new Gig({
			influencer: req.user._id,
			title,
			description,
			price,
			deliveryTime,
			revisions,
			images,
			category,
		});

		await newGig.save();
		res.status(201).json({
			message: 'Gig created successfully',
			gig: newGig,
		});
	} catch (error) {
		console.error('Create Gig Error:', error);
		res.status(500).json({ message: 'Server error creating gig' });
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
const getInfluencerGigs = async (req, res) => {
	try {
		const { id } = req.params;
		const gigs = await Gig.find({ influencer: id });
		res.json(gigs);
	} catch (error) {
		console.error('Get Influencer Gigs Error:', error);
		res.status(500).json({ message: "Error fetching influencer's gigs" });
	}
};

module.exports = {
	createGig,
	getAllGigs,
	getInfluencerGigs,
};
