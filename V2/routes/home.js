const express = require("express");
const router  = express.Router();
const Home    = require("../models/home");

// GET homes through email
router.get("/:email", (req, res) => {
    Home.find({adminEmail: req.params.email}, (err, homes) => {
        if(err) {
            console.log(err)
        } else {
            console.log(homes)
            res.send(homes)
        }
    })
});

// POST new home
router.post("/", (req, res) => {
    const name       = req.body.name;
    const adminEmail = req.body.adminEmail;
    
    const home = {name: name, adminEmail: adminEmail}

    Home.create(home, (err, addedhome) => {
        if(err) console.log(err)
        else {
            // add this user to the home and make him admin
            console.log("Added", addedhome);
            res.send(addedhome)
        }
    })
})

module.exports = router;