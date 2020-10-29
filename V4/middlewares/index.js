const jwt = require('jsonwebtoken');
const User = require('../models/user')
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else
    req.flash("error", "You need to be logged in to do that")
    // res.send("Not authenticated")
    res.redirect("/admin/login")
}

middlewareObj.authenticateToken = (req, res, next) => {
    // const token = req.headers.authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if(token == null) {
        console.log('no token')
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send(err)
        User.findOne({username: user.username}, (err, user) => {
            if(err) console.log('err')
            console.log('authenticated ' + user.email)
            req.user = user
            next()
        })
    })
}

module.exports = middlewareObj;