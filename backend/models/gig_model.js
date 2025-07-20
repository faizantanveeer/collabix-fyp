const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
	{
		influencer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		deliveryTime: {
			type: Number, // in days
			required: true,
		},
		revisions: {
			type: Number,
			default: 1,
		},
		images: [String], // URLs to gig images
		category: {
			type: String,
			enum: ['content creation', 'shoutout', 'review', 'other'],
			default: 'other',
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Gig', gigSchema);
