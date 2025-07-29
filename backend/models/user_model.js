const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: {
			type: String,
			required: function () {
				// Only require password if not using Google login
				return !this.isGoogleUser;
			},
		},
		isGoogleUser: {
			type: Boolean,
			default: false,
		},

		role: {
			type: String,
			enum: ['business', 'influencer'],
			required: true,
		},
		profileImage: { type: String },
		bio: { type: String },
		niche: { type: String },
		location: { type: String },
		googleId: {
			type: String,
			unique: true,
			sparse: true,
		},

		// Social Media & Analytics
		socialLinks: [
			{
				platform: {
					type: String,
					enum: [
						'instagram',
						'twitter',
						'youtube',
						'tiktok',
						'facebook',
						'linkedin',
						'pinterest',
						'snapchat',
					],
					required: true,
				},
				url: { type: String, required: true },
				followers: { type: Number, default: 0 },
			},
		],

		// Influencer-Specific Fields
		influencerDetails: {
			pastCollaborations: [
				{ type: mongoose.Schema.Types.ObjectId, ref: 'Collaboration' },
			],
			ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
			totalFollowers: { type: Number, default: 0 },
		},

		// Business-Specific Fields
		businessDetails: {
			companyName: { type: String },
			website: { type: String },
			industry: { type: String },
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtual field for total followers across all platforms
userSchema.virtual('totalFollowers').get(function () {
	return (
		this.socialLinks?.reduce(
			(total, link) => total + (link.followers || 0),
			0
		) || 0
	);
});

// Virtual field for average influencer rating
userSchema.virtual('averageRating').get(function () {
	if (
		!this.influencerDetails?.ratings ||
		this.influencerDetails.ratings.length === 0
	)
		return 0;
	return (
		this.influencerDetails.ratings.reduce(
			(sum, review) => sum + review.rating,
			0
		) / this.influencerDetails.ratings.length
	);
});

// Pre-save middleware to update totalFollowers
userSchema.pre('save', function (next) {
	if (this.role === 'influencer') {
		this.influencerDetails.totalFollowers =
			this.socialLinks?.reduce(
				(total, link) => total + (link.followers || 0),
				0
			) || 0;
	}
	next();
});

userSchema.pre('remove', async function (next) {
	console.log(`Cascade deleting data for user: ${this._id}`);

	try {
		// This is the efficient way to delete all gigs by this influencer
		await mongoose.model('Gig').deleteMany({ influencer: this._id });

		// ... continue with deleting collaborations and reviews as discussed

		next();
	} catch (error) {
		console.error('Error during cascade deletion for user:', error);
		next(error);
	}
});

module.exports = mongoose.model('User', userSchema);
