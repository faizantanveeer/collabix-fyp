var express = require('express');
const verifyToken = require('../middleware/isLoggedIn');
var router = express.Router();
var authRouter = require('./auth');
const { dashboardHandler } = require('../controllers/dashboardController');
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Collabix' });
});

router.get('/home', function(req, res){
  res.render('home.ejs')
})

router.get('/dashboard', verifyToken, dashboardHandler)

router.use('/auth', authRouter);



module.exports = router;


