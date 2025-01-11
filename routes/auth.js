var express = require('express')
var router = express.Router()
const {loginHanlder, signupHandler, logoutHandler} = require('../controllers/authController')

// router.get('/auth/login', loginHanlder)

router.get('/signup', (req, res)=>{
res.send("Ehhlo")
})

// router.get('/auth/logout', logoutHandler)

module.exports = router
