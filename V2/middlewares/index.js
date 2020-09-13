const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else
    // req.flash("error", "You need to be logged in to do that")
    res.send("Not authenticated")
    // res.redirect("/au/login")
}

module.exports = middlewareObj;