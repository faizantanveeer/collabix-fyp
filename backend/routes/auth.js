var express = require('express');
const { signupHandler, loginHandler, logoutHandler } = require('../controllers/authController');
const isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();  


router.post('/signup', signupHandler);

router.post('/login', loginHandler)

router.get('/logout', logoutHandler)





module.exports = router;
