var express = require('express');
const authenticateUser = require('../middleware/isLoggedIn');
var router = express.Router();
var authRouter = require('./auth');
const userRoutes = require("./user");
const { dashboardHandler } = require('../controllers/dashboardController');



router.get('/', function(req, res, next) {
  res.render('index', { title: 'Collabix' });
});

router.get('/home', function(req, res){
  res.render('home.ejs')
})

router.get('/dashboard', dashboardHandler) 

router.use('/auth', authRouter);

router.use("/user", userRoutes);




module.exports = router;


