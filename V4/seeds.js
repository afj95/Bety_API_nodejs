const mongoose   = require("mongoose"),
      Home       = require("./models/home"),
      Stuff      = require("./models/stuff");


const homesList = [
    {
        name: "Home1",
        adminEmail: "ahmad@gmail.com",
    },
    {
        name: "Home2",
        adminEmail: "rayed@gmail.com"
    }
]

const stuffsList = [
    {
        name: "test1",
        notes: ""
    },
    {
        name: "test2",
        notes: ""
    }
]   

seedDB = () => {
    // // Remove all Homes
    Home.deleteMany({}, (err) => {
        if(err) console.log(err)
        console.log("Removed homes")
    })

    // Remove all Stuffs
    Stuff.deleteMany({}, (err) => {
        if(err) console.log(err)
        console.log("Removed stuffs")
    })

    homesList.forEach((home) => {
        var createdHome = new Home(home);
        stuffsList.forEach((stuff) => {
            var stuffCreated = new Stuff(stuff)
            stuffCreated.homeId = createdHome._id;
            createdHome.stuffs.push(stuffCreated);
            stuffCreated.save();
        })
        createdHome.save((err, createdHomeDone) => {
            if(err) console.log(err)
            else console.log(createdHomeDone);
        })        
    })   
}

module.exports = seedDB;