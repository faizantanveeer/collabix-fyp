var express = require('express');
const { signupHandler, loginHandler, logoutHandler } = require('../controllers/authController');
const isLoggedIn = require('../middleware/isLoggedIn');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Collabix' });
});

router.get('/home', function(req, res){
  res.render('home.ejs')
})

router.post('/signup', signupHandler);

router.get('/login', loginHandler)

router.get('/logout', logoutHandler)




module.exports = router;
