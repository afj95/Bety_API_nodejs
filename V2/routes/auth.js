const
    express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user'),
    middleware = require("../middlewares") // automatically will require index.js

var status = {message: ""}

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => res.render('register'))

router.post('/register', (req, res) => {
    
    // console.log('body: ',req.body)
    
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var emailPattern = pattern.test(String(req.body.email).toLowerCase());

    // console.log(emailPattern)
    // res.send("testing")
    // return

    if(emailPattern) {
        // Add new user to db
        var newUser = new User(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                phoneNumebr: req.body.phoneNumebr
            });

        User.findOne({email: req.body.email}, (err, user) => {
            if(err) {
                status.message = "Some errors happened"
                console.log(err)
                res.send(status + err)
            }
            if(user) {
                status.message = "A user with the given email is already registered"
                console.log(status)
                res.send(status)
            } else {
                console.log("not found")
                User.register(newUser, req.body.password, (err, user) => {
                    if(err) {
                        status.message = err.message;
                        console.log(status)
                        res.send(status)
                    } else {
                        console.log(newUser)
                        passport.authenticate("local")(req, res, () => {
                            status.message = "success"
                            res.send(status)
                        });
                    }
                })
            }
        })
    } else {
        status.message = "Invalid email, Please enter a valid email!";
        console.log(status)
        res.send(status)
    }
})

router.get('/login', (req, res) => res.render('login'))

// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/au/login',
// }))
router.post('/login', passport.authenticate('local'), (req, res) => {
    status.message = "successs"
    res.send(status)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success', 'Logged you out!')
    req.redirect('/index')
})

module.exports = router;

