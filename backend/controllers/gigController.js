const Gig = require('../models/gig_model');
const User = require('../models/user_model');

// ✅ Create a new gig
const createGig = async (req, res) => {
	try {
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

const getGigsDatabyId = async (req, res) => {
	try {
		const { id } = req.params;
		const gigs = await Gig.find({ _id: id });
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

		const user = await User.findOne({ email: req.user.email });

		if (!user) {
			return res.status(404).json({ message: 'User profile not found' });
		}

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

const deleteGig = async (req, res) => {
	try {
		const { id } = req.params;
		const gig = await Gig.findById(id);

		if (!gig) {
			return res.status(404).json({ message: 'Gig not found' });
		}

		await Gig.findByIdAndDelete(id);
		res.status(200).json({ message: 'Gig deleted successfully' });
	} catch (error) {
		console.error('Delete Gig Error:', error);
		res.status(500).json({ message: 'Error deleting gig' });
	}
};

const editGig = async (req, res) => {
	try {
		const { id } = req.params;

		const gig = await Gig.findById(id);
		if (!gig) return res.status(404).json({ message: 'Gig not found' });

		const {
			title,
			description,
			price,
			deliveryTime,
			revisions,
			category,
			isActive,
		} = req.body;

		// Defensive checks
		if (
			!title ||
			!description ||
			!price ||
			!deliveryTime ||
			!revisions ||
			!category
		) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		gig.title = title;
		gig.description = description;
		gig.price = Number(price);
		gig.deliveryTime = Number(deliveryTime);
		gig.revisions = Number(revisions);
		gig.category = category;
		gig.isActive = isActive === 'true' || isActive === true;

		// Handle new image upload
		if (req.files?.image?.[0]) {
			gig.images = [req.files.image[0].filename];
		} else if (req.files?.images) {
			gig.images = req.files.images.map((file) => file.filename);
		}

		await gig.save();
		res.status(200).json({ message: 'Gig updated successfully', gig });
	} catch (error) {
		console.error('Edit Gig Error:', error);
		res.status(500).json({ message: 'Error updating gig' });
	}
};

module.exports = {
	createGig,
	getAllGigs,
	getInfluencerGigs,
	getGigsDatabyId,
	deleteGig,
	editGig,
};
