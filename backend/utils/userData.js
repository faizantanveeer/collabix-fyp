const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user_model');
const Gig = require('../models/gig_model');

const seedRealisticData = async () => {
	await mongoose.connect('mongodb://localhost:27017/collabix');

	await User.deleteMany({});
	await Gig.deleteMany({});

	const influencers = [
		{
			name: 'Ayesha Khan',
			email: 'ayesha@gmail.com',
			niche: 'beauty',
			bio: 'Beauty enthusiast sharing skincare secrets.',
			location: 'Lahore',
		},
		{
			name: 'Zain Raza',
			email: 'zain@gmail.com',
			niche: 'tech',
			bio: 'Tech reviews and smart gadget showcases.',
			location: 'Karachi',
		},
		{
			name: 'Sana Malik',
			email: 'sana@gmail.com',
			niche: 'travel',
			bio: 'Exploring the world and sharing the adventure.',
			location: 'Islamabad',
		},
		{
			name: 'Hamza Qureshi',
			email: 'hamza@gmail.com',
			niche: 'fitness',
			bio: 'Helping you live a healthier life.',
			location: 'Rawalpindi',
		},
		{
			name: 'Maira Ali',
			email: 'maira@gmail.com',
			niche: 'fashion',
			bio: 'Fashionista uncovering seasonal trends.',
			location: 'Faisalabad',
		},
	];

	const savedUsers = [];

	for (let i = 0; i < influencers.length; i++) {
		const influencer = influencers[i];
		const hashedPassword = await bcrypt.hash('test', 10);

		const user = new User({
			name: influencer.name,
			email: influencer.email,
			password: hashedPassword,
			role: 'influencer',
			isGoogleUser: false,
			bio: influencer.bio,
			niche: influencer.niche,
			location: influencer.location,
			profileImage: `${i + 1}.png`,
			socialLinks: [
				{
					platform: 'instagram',
					url: `https://instagram.com/${influencer.name
						.replace(' ', '')
						.toLowerCase()}`,
					followers: 5000 + i * 1000,
				},
				{
					platform: 'youtube',
					url: `https://youtube.com/${influencer.name
						.replace(' ', '')
						.toLowerCase()}`,
					followers: 3000 + i * 800,
				},
			],
			influencerDetails: {
				pastCollaborations: [],
				ratings: [],
				totalFollowers: 0, // Will be calculated by pre-save hook
			},
			businessDetails: {}, // Not applicable to influencers
		});

		await user.save();
		savedUsers.push(user);
	}

	const gigTitles = [
		'Instagram Shoutout',
		'YouTube Product Review',
		'Unboxing Video',
		'Reel Collaboration',
		'Brand Endorsement Post',
		'Fitness Challenge Promo',
		'Tech Product Showcase',
		'Fashion Try-on Haul',
		'Skincare Routine Demo',
		'Adventure Vlog',
		'Cooking Challenge',
		'Live Q&A Session',
		'Tutorial Video',
		'Giveaway Promotion',
		'Behind-the-Scenes Story',
		'Podcast Guest Spot',
		'Event Coverage',
		'Product Photography',
		'Story Highlights Package',
		'Reaction Video',
		'Motivational Post',
		'Branding Advice',
		'Audience Poll',
		'Exclusive Content Drop',
		'Mini Interview',
	];

	const gigCategories = ['shoutout', 'review', 'content creation', 'other'];

	for (let i = 0; i < 15; i++) {
		const randomUser = savedUsers[i % savedUsers.length]; // even distribution
		const gig = new Gig({
			influencer: randomUser._id,
			title: gigTitles[i],
			description: `This gig offers ${gigTitles[
				i
			].toLowerCase()} tailored to your brand needs.`,
			price: 5000 + i * 250,
			deliveryTime: 3 + (i % 5), // 3 to 7 days
			revisions: 1 + (i % 3),
			images: [`${i + 1}.png`],
			category: gigCategories[i % gigCategories.length],
			isActive: true,
		});
		await gig.save();
	}

	console.log('✅ 25 gigs seeded successfully!');

	console.log('✅ Full influencer profiles seeded!');
	process.exit(0);
};

seedRealisticData();
