const express = require('express');
const router = express.Router();
const passport = require('passport');
const middleware = require('../middlewares');

const User  = require('../models/user');
const Home  = require('../models/home');

router.get('/', (req, res) => res.redirect('/admin/dashboard'))

router.get('/login', (req, res) => res.render('admin/login'))

router.post('/login', (req, res, next) => {
    // log in admin

    passport.authenticate('local', (err, user, info) => {
        if(err) {
            req.flash('error', err);
            return res.redirect('/admin/login')
        }
        if(!user) {
            req.flash('error', 'No account with that email address exists');
            return res.redirect('/admin/login')
        }

        req.logIn(user, err => {
            if (err) {
                req.flash('error', err);
                return res.redirect('/admin/login')
            }

            req.flash('success', 'Logged in')
            return res.redirect('/admin/dashboard')
        });
    })(req, res, next);
})

router.get('/dashboard', async (req, res) => {

    var data = {};

    await User.find({}, (err, users) => {
        if(err) req.flash('error', err)
        data.users = users;
    })

    await Home.find({}, (err, homes) => {
        if(err) req.flash('error', err)
        data.homes = homes;
    })

    // res.send(data)
    res.render('./admin/dashboard', {data: data})
})

router.get('/:userId/info', (req, res) => {
    let data = {};
    data.userHomes = [];
    data.stuffs = [];

    User.findById(req.params.userId)
    .populate('homes')
    .populate('stuffs')
    .exec(async(err, user) => {
        if(err) {
            console.log(err)
            return
        }
        data.user = user;
        data.userHomes = user.homes;
        res.render('./admin/userInfo', { data: data });
    })

    // User.findById(req.params.userId, async (err, user) => {
    //     if(err) {
    //         console.log(err)
    //         return
    //     }
    //     data.user = user;
        
    //     await user.homes.forEach((home) => {
    //         Home.findById(home, (err, home) => {
    //             if(err) {
    //                 console.log(err)
    //                 return
    //             }
    //             data.userHomes.push(home);
    //         })
    //         console.log('homes:', data.userHomes);
    //         res.render('./admin/userInfo', { data: data });
    //     })
    // })
})


module.exports = router;