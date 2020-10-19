const express = require("express");
const router   = express.Router();

const Home  = require("../models/home");
const Stuff = require("../models/stuff");
const { route } = require("../routes/home");

// Home page - index
router.get("/", (req, res) => {
    res.redirect("/be/homes")
})

//===============================================

//GET all homes
router.get("/homes", (req, res) => {
    Home.find({_id: "5f7f8aaf34751610ac0db6c8"}, (err, homes) => {
        if(err) console.log(err)
        else {
            res.send(homes)
        }
    })
})

router.delete('/de', (req, res) => {
    Home.findByIdAndRemove({_id: '5f7f8aaf34751610ac0db6c8'}, (err) => {
        if(err) return err
        return res.json('deleted')
    })
})

//GET all stuffs
router.get("/stuffs", (req, res) => {
    Stuff.find({}, (err, stuffs) => {
        if(err) console.log(err)
        else {
            res.send(stuffs)
        }
    })
})

// GET all users

module.exports = router;