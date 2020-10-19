const express       = require("express");
const router        = express.Router();
const Stuff         = require("../models/stuff");
const Home          = require("../models/home");
const DeletedStuff  = require("../models/deletedStuff");


// GET stuffs through homeId
router.get("/:homeId", (req, res) => {
    var homeId = req.params.homeId;

    Stuff.find({homeId: homeId}, (err, stuffsFounded) => {
        if(err) console.log(err)
        else {
            // console.log(stuffsFounded)
            res.send(stuffsFounded)
        }
    })
})

// Adding new stuff
router.post("/:homeId", (req, res) => {

    var addedStuff = new Stuff({
            name: req.body.name,
            notes: req.body.notes,
            homeId: req.params.homeId
        }
    );

    // console.log(addedStuff._id);

    addedStuff.save((err, data) => {
        if(err) console.log(err)
        else {
            // console.log("stuff: ", data)

            Home.findById(req.params.homeId, (err, foundedHome) => {
                if(err) console.log(err)
                else {
                    foundedHome.stuffs.push(data)
                    // console.log(foundedHome)
                    foundedHome.save();
                }
            })
        }
    });
})

// Delete stuff
router.delete("/:stuffId", (req, res) => {
    Stuff.findById(req.params.stuffId, (err, foundedStuff) => {
        if(err) console.log("ERROR:", err)
        else {
            console.log("founded:", foundedStuff);
            new DeletedStuff(
                {
                    name: foundedStuff.name,
                    notes: foundedStuff.notes,
                    price: foundedStuff.price
                }
            ).save((err, data) => {
                if(err) console.log('ERROR:', err)
                else console.log('ADDED:', data)
            })
            Stuff.deleteOne(foundedStuff, (err, result) => {
                if(err) console.log("err:", err)
                else console.log("DONE")
            })
        }
    })
})

module.exports = router;