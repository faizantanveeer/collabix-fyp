const Collaboration = require('../models/collaboration_model');
const Notification = require('../models/notification_model');
const User = require('../models/user_model');

const createCollaboration = async (req, res) => {
	try {
		const {
			business,
			influencer,
			campaign,
			budget,
			description,
			deliverables,
		} = req.body;

		if (
			!business ||
			!influencer ||
			!campaign ||
			!budget ||
			!description ||
			!deliverables
		) {
			return res.status(400).json({ message: 'All fields are required' });
		}

		// Check for duplicate request

		const isDuplicate = false;
		const existingRequest = await Collaboration.findOne({
			business,
			influencer,
			budget,
			description,
			deliverables,
			campaign,
		});

		if (existingRequest) {
			return res.status(400).json({
				message: 'You have already sent this collaboration request!',
				isDuplicate: true,
			});
		}

		const newCollaboration = new Collaboration({
			business,
			influencer,
			campaign,
			budget,
			description,
			deliverables,
			file: req.file ? req.file.path : null,
		});

		await newCollaboration.save();
		res.status(201).json({
			message: 'Collaboration request created successfully',
			collaboration: newCollaboration,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
};

const statusHandler = async (req, res) => {
	try {
		const { status } = req.body; // status should be 'accepted' or 'rejected'
		if (!['accepted', 'rejected'].includes(status)) {
			return res.status(400).json({ error: 'Invalid status' });
		}

		const updatedRequest = await Collaboration.findByIdAndUpdate(
			req.params.id,
			{ status },
			{ new: true }
		);

		if (!updatedRequest) {
			return res.status(404).json({ error: 'Request not found' });
		}

		res.json(updatedRequest);
	} catch (error) {
		res.status(500).json({ error: 'Server error' });
	}
};

const getCollaborationInfluencer = async (req, res) => {
	const { id } = req.params; // Influencer ID from request params

	try {
		const collaborations = await Collaboration.find({
			influencer: id,
		}).populate('business', 'name'); // Populate business details

		if (!collaborations) {
			return res
				.status(404)
				.json({ message: 'No collaboration requests found' });
		}

		res.status(200).json(collaborations || []);
	} catch (error) {
		console.error('Error fetching collaborations:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
};

const deleteCollaboration = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedCollaboration = await Collaboration.findByIdAndDelete(id);

		console.log(`Collaboration with ID ${id} deleted:`, deletedCollaboration);

		if (!deletedCollaboration) {
			return res
				.status(404)
				.json({ message: 'Collaboration request not found' });
		}

		return res
			.status(200)
			.json({ message: 'Collaboration request deleted successfully' });
	} catch (error) {
		console.error('Error deleting collaboration:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = {
	createCollaboration,
	statusHandler,
	getCollaborationInfluencer,
	deleteCollaboration,
};
