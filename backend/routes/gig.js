const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const {
	createGig,
	getAllGigs,
	getGigsDatabyId,
	getInfluencerGigs,
	deleteGig,
	editGig,
	exploreMoreGigs,
	getInfluencerOtherGigs,
} = require('../controllers/gigController');
const { influencerOnly, isLoggedIn } = require('../middleware/isLoggedIn');

router.post(
	'/create',
	upload.fields([{ name: 'images', maxCount: 5 }]),
	influencerOnly,
	createGig
);

router.get('/all', getAllGigs); // Publicly visible

router.get('/influencer', isLoggedIn, getInfluencerGigs);

router.get('/explore_gigs/:id', getInfluencerOtherGigs);

router.get('/explore_gigs/', exploreMoreGigs)

router.delete('/delete/:id', isLoggedIn, deleteGig);

router.get('/:id', isLoggedIn, getGigsDatabyId);

router.put(
	'/:id',
	upload.fields([
		{ name: 'images', maxCount: 5 },
		{ name: 'image', maxCount: 1 },
	]),
	influencerOnly,
	editGig
);

module.exports = router;
