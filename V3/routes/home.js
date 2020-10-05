const express = require('express');
const router  = express.Router();
const Home    = require('../models/home');
const User    = require('../models/user');
const middleware = require('../middlewares');

// GET homes through email
// ToDo: Get homes through members
router.get('/:email', (req, res) => {

    var userEmail = req.params.email;

    User.findOne(userEmail, (err, user) => {
        console.log(user);
    })

    // Home.find({adminEmail: req.params.email}, (err, foundedHomes) => {
    //     if(err) {
    //         console.log(err)
    //     } else {
    //         var homes = []
    //         foundedHomes.forEach((home) => {
    //             var h =
    //             {
    //                 _id: home._id,
    //                 name: home.name,
    //                 members: home.members.length,
    //                 stuffs: home.stuffs.length,
    //                 created: home.created
    //             }
    //             homes.push(h)
    //         })
    //         res.json(homes)
    //     }
    // })
});

// CREATE new home
router.post('/',  (req, res) => {
    const name       = req.body.name;
    const adminEmail = req.body.adminEmail;
    
    const home = {name: name, adminEmail: adminEmail}

    Home.create(home, (err, addedhome) => {
        if(err) console.log(err)
        else {
            // add this user to the home and make him admin
            console.log('Added', addedhome);
            res.send(addedhome)
        }
    })
})

// Editing home name
router.put('/:homeId', middleware.isLoggedIn, (req, res) => {
    Home.findByIdAndUpdate(req.params.homeId, req.body.home, (err, foundedHome) => {
        if(err) console.log(err)
        else {
            // res.send(200, foundedHome)
            console.log(foundedHome)
        }
    })
})

// Delete home
router.delete('/:homeId', middleware.isLoggedIn, (req, res) => {
    
})

// Add new admin
router.put('/admins/:homeId', middleware.isLoggedIn, (req, res) => {
    Home.findById(req.params.homeId, (err, home) => {
        if(err) console.log(err)
        else {
            // console.log(home.adminEmail)
            // res.send('done')
            console.log('before:', home)
            home.adminEmail.push(req.body.email)
            home.save();
            console.log('after:', home)
            res.send('done')
        }
    })
})

module.exports = router;