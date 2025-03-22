var express = require('express');
const { signupHandler, loginHandler, logoutHandler,googleLoginHandler } = require('../controllers/authController');
var router = express.Router();  


router.post('/signup', signupHandler);

router.post('/login', loginHandler)

router.get('/logout', logoutHandler)


router.post('/google-login', googleLoginHandler)





module.exports = router;
