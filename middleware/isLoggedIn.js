const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        res.send('not logged in')
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); 
    } catch (err) {
        req.user = null
        res.redirect('/login');
    }
};

module.exports = isLoggedIn;