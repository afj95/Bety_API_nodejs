const
    express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require('../models/user'),
    middleware = require('../middlewares'),
    crypto     = require('crypto'),
    async      = require('async'),
    nodemailer = require("nodemailer"),
    jwt        = require('jsonwebtoken'),
    Isemail    = require('isemail');

var status = {message: ''}

router.get('/', (req, res) => res.redirect('/au/login'))

router.get('/register', (req, res) => res.render('register'))

router.post('/register', (req, res) => {

    var emailPattern = Isemail.validate(req.body.email)

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
                status.message = 'Some errors happened'
                console.log(err)
                res.status(500).send(status + err)
            }
            if(user) {
                status.message = 'A user with the given email is already registered'
                console.log(status)
                res.status(403).send(status)
            } else {
                // console.log('not found')
                User.register(newUser, req.body.password, (err, user) => {
                    if(err) {
                        status.message = err.message;
                        console.log(status)
                        res.status(500).send(status)
                    } else {
                        // console.log(newUser)
                        passport.authenticate('local')(req, res, () => {
                            status.message = 'success'
                            res.status(201).send(status)
                        });
                    }
                })
            }
        })
    } else {
        status.message = 'Invalid email, Please enter a valid email!';
        console.log(status)
        res.status(400).send(status)
    }
})

router.get('/login', (req, res) => res.render('login'))

router.post('/login', (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) { return next(err);}
        if (!user) { status.message = 'Wrong username or password!'; return res.status(404).send(status)}

        var accessToken = await generaAccessToken(user);
        // console.log('user:', req.user)
        req.logIn(user, err => {
            if (err) {
                console.log('err:', err);
                return next(err);
            }
            console.log('logged in')
            // console.log('user:', req.user)
            res.status(200).json({ message: 'success', user: user, token: accessToken });
        });
    })(req, res, next);
})

generaAccessToken = user => {
    var jsonObj = { username: user.username };

    return jwt.sign(jsonObj, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' });
}

router.get('/getCurrentUser', middleware.authenticateToken, (req, res, next) => {req.user ? res.status(200).json({ user: req.user }) : res.status(404).send()})

router.get('/logout', (req, res) => {
    // console.log('user:', req.user)
    req.logOut()
    // console.log('user:', req.user)
    status.message = 'success'
    res.send(status)
})

router.get('/forgot', (req, res) => {
    res.render('forgot')
})

router.post('/forgot', (req, res, next) => {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, (err, buf) => { // Generates cryptographically strong pseudo-random data
                var token = buf.toString('hex');
                done(err, token)
            });
        },
        function (token, done) {
            User.findOne({email: req.body.email}, (err, user) => {
                if(!user) {
                    req.flash('error', 'No account with that email address exists');
                    console.log('error', 'No account with that email address exists');
                    return res.redirect('/au/forgot');
                }
                else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 900000 // 0.25 hour

                    user.save((err) => {
                        done(err, token, user)
                    })
                }
            })
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                secure: true,
                service: 'Gmail',
                auth: {
                    user: 'for.devs.only@gmail.com',
                    pass: process.env.GMAILPW
                }
            });

            var mailOptions = {
                to: user.email,
                from: 'Bety App',
                subject: 'Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                  'http://' + req.headers.host + '/au/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            smtpTransport.sendMail(mailOptions, function(err) {
                console.log('mail sent');
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                // console.log('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                // status.message = 'An e-mail has been sent to ' + user.email + ' with further instructions.'
                // res.send(status)
                done(err, 'done');
            });
        }
    ], (err) => {
            if(err) return next(err)
            // res.send('some error heppened')
            res.redirect('/au/forgot');
        }
    )
})

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        // status.message = 'Password reset token is invalid or has expired.'
        // res.send(status)
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
router.post('/reset/:token', function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                // status.message = 'Password reset token is invalid or has expired.';
                // res.send(status)
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
            }
            if(req.body.password === req.body.confirm) {
                user.setPassword(req.body.password, function(err) {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
    
                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                })
            } else {
                req.flash("error", "Passwords do not match.");
                return res.redirect('back');
            }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: 'for.devs.only@gmail.com',
                pass: process.env.GMAILPW
            }
            });
            var mailOptions = {
            to: user.email,
            from: 'for.devs.only@gmail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
            });
        }
    ], function(err) {
      res.redirect('/au');
    });
});



router.get('/testing', middleware.isLoggedIn, (req, res) => {

    res.json({message: 'done'})
    // if(!req.session.user) {
    //     console.log('session:', req.session.user)
    //     res.status(404).send('Not Authenticated')
    // } else {
    //     // console.log('session:', req.session)
    //     console.log(req.session)
    //     res.status(201).send('Authenticated')
    // }
})

module.exports = router;