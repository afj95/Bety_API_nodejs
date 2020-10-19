const express    = require('express');
const router     = express.Router();
const Home       = require('../models/home');
const User       = require('../models/user');
const middleware = require('../middlewares');

// GET homes through email
// ToDo: Get homes from homes list for each user                    DONE

router.get('/', middleware.authenticateToken, async (req, res) => {

    var userEmail = req.user.email;

    User.findOne({email: userEmail})
    .populate('homes')
    .exec( async (err, user) => {
        if(err) return res.status(500).send();
        if(!user) return res.status(500).send();

        var homes = [];
        await user.homes.forEach(home => {
            var h = {
                _id: home._id,
                name: home.name,
                members: home.members.length,
                stuff: home.stuffs.length
            }
            homes.push(h);
        })

        if(homes.length == 0) return res.status(404).send();
        return res.status(200).send(homes)
    })
});

// CREATE new home
router.post('/', middleware.authenticateToken, (req, res) => {

    const name       = req.body.name;
    const adminEmail = req.user.email;

    var home = new Home({name: name});

    User.findOne({email: adminEmail}, async (err, admin) => {
        if(err) return res.status(500).send();

        home.members.push(admin._id);
        home.admins.push(admin._id);
        admin.homes.push(home._id);
        
        await home.save(err => {if(err) return res.status(500).send() });
        await admin.save(err => {if(err) return res.status(500).send() });

        // console.log('home:', home);
        res.status(201).json(home);
    });
})

router.get('/info/:homeId', middleware.authenticateToken, (req, res) => {
    homeId = req.params.homeId;

    Home.findById({_id: homeId}, (err, home) => {
        if(err) return res.status(500).send();
        if(!home) return res.status(404).send();

        var theDateCreated = '';
        switch(Number(home.created.getDay())) {
            case 0:
                theDateCreated += 'Sun'
                break;
            case 1:
                theDateCreated += 'Mon'
                break;
            case 2:
                theDateCreated += 'Tues'
                break;
            case 3:
                theDateCreated += 'Wed'
                break;
            case 4:
                theDateCreated += 'Thu'
                break;
            case 5:
                theDateCreated += 'Fri'
                break;
            case 6:
                theDateCreated += 'Sat'
                break;
        }
        var h = {
            name: home.name,
            members: home.members.length,
            stuffs: home.stuffs.length,
            created: theDateCreated + '/' + (Number(home.created.getMonth())+1) + '/' + home.created.getFullYear()
        }
        // console.log(h)
        return res.status(200).json(h);
    })
})

router.delete('/del/:homeId', middleware.authenticateToken, (req, res) => {

    var userId = req.user._id;
    var listOfHomes = [];

    Home.findByIdAndRemove(req.params.homeId, async (err, home) => {
        if(err) return res.status(500).json(err);
        await User.findById(userId, (err, user) => {
            if(err) return res.status(500).json(err);
            
            listOfHomes = user.homes;
            listOfHomes.pop(req.params.homeId)
            user.save(err => {
                if(err) {
                    console.log('err: ', err);
                    return res.status(500).send()
                }
            })
        })
        return res.status(200).send();
    })
})

router.put('/:homeId', (req, res) => {

    Home.findByIdAndUpdate(req.params.homeId, req.body.home, (err, updatedHome) => {
        if(err) console.log(err)
        else {
            console.log(updatedHome)
            res.status(200).send(updatedHome)
        }
    })
})


// FINISHED ^

// router.get('/tt/tt', (req, res) => {
//     list = [];
//     User.findById('5f803f3b63a7eb0b64563663', (err, user) => {
        
//         console.log(user.homes);
//         user.homes = []
//         console.log(user.homes);
//         user.save();
//     })

//     return res.send();
// })

// NOT FINISHED

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

router.get('/testing', (req, res) => {
    
})

module.exports = router;