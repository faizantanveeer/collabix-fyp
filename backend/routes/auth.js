var express = require('express');
const { signupHandler, loginHandler, logoutHandler } = require('../controllers/authController');
var router = express.Router();  


router.post('/signup', signupHandler);

router.post('/login', loginHandler)

router.get('/logout', logoutHandler)





module.exports = router;
