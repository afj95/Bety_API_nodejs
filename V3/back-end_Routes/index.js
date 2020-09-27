const express = require("express");
const router   = express.Router();

const Home  = require("../models/home");
const Stuff = require("../models/stuff");

// Home page - index
router.get("/", (req, res) => {
    res.redirect("/be/homes")
})

//===============================================

//GET all homes
router.get("/homes", (req, res) => {
    Home.find({}, (err, homes) => {
        if(err) console.log(err)
        else {
            res.send(homes)
        }
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