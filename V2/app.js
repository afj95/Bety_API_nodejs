const express    = require("express"),
      app        = express(),

      mongoose   = require("mongoose"),
      bodyParser = require("body-parser"),
      Home       = require("./models/home"),
      Stuff      = require("./models/stuff"),
      seedDB     = require("./seeds"),

      BE         = require("./back-end_Routes");
      
// ROUTES
// const authRoutes  = require("./routes/auth");
const homeRoutes  = require("./routes/home");
const stuffRoutes = require("./routes/stuff");

mongoose.connect(process.env.DATABASEURL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// console.log(process.env.DATABASEURL)

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.set('view engine', 'ejs') // For .ejs files

// seedDB();

// Back-End route
app.use("/be/v1", BE)

// app.use("/au", authRoutes);
app.use("/homes", homeRoutes);
app.use("/stuffs", stuffRoutes);

//================================================
app.listen(process.env.PORT || 3300, process.env.IP, () => {
    console.log("SERVER IS LISTENING...")
})