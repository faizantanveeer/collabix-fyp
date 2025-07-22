const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
	createGig,
	getAllGigs,
	getInfluencerGigs,
	getInfluencerGigsbyId,
} = require('../controllers/gigController');
const { influencerOnly, isLoggedIn } = require('../middleware/isLoggedIn');

router.post(
	'/create',
	upload.fields([
		{ name: 'images', maxCount: 5 }, // allow multiple image uploads
	]),
	influencerOnly,
	createGig
); // Only influencers should be allowed

router.get('/all', getAllGigs); // Publicly visible

router.get('/influencer', isLoggedIn, getInfluencerGigs);

router.get('/influencer/:id', getInfluencerGigsbyId); // Public or protected

module.exports = router;
