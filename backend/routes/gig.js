const express = require('express');
const router = express.Router();
const {
	createGig,
	getAllGigs,
	getInfluencerGigs,
} = require('../controllers/gigController');
const { influencerOnly } = require('../middleware/isLoggedIn');

router.post('/create', influencerOnly, createGig); // Only influencers should be allowed
router.get('/all', getAllGigs); // Publicly visible
router.get('/influencer/:id', getInfluencerGigs); // Public or protected

module.exports = router;
