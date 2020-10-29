const express       = require("express");
const router        = express.Router();
const Stuff         = require("../models/stuff");
const Home          = require("../models/home");
const DeletedStuff  = require("../models/deletedStuff");
const middlewareObj = require("../middlewares");

/** 
 * All routes starts with: stuffs
 * http://localhost:3000/stuffs/...
*/

// GET stuffs through homeId
router.get("/:homeId", middlewareObj.authenticateToken, (req, res) => {
    
    var homeId = req.params.homeId;

    Stuff.find({homeId: homeId}, (err, stuffsFounded) => {
        if(err) return res.status(500).send();
        if(!stuffsFounded) return res.status(404).send();

        return res.status(200).send(stuffsFounded)
    })
})

// Adding new stuff
router.post("/add", async (req, res) => {    

    var addedStuff = new Stuff({
            stuff: req.body.stuff,
            notes: req.body.notes,
            homeId: req.body.homeId
        }
    );

    await addedStuff.save(async (err, savedStuff) => {
        if(err) return res.status(500).send();

        await Home.findById(req.body.homeId, async (err, foundedHome) => {
            if(err) return res.status(500).send();
            foundedHome.stuffs.push(savedStuff._id)
            // console.log(foundedHome)
            await foundedHome.save();
            // console.log(foundedHome.stuffs)
            return res.status(201).json({ homeStuffs: foundedHome.stuffs })
        })
    });
})

// FINISHED ^

/*
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
*/

module.exports = router;