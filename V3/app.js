const
    express            = require('express'),
    app                = express(),
    seedDB             = require('./seeds'),
    passport           = require('passport'),
    mongoose           = require('mongoose'),
    bodyParser         = require('body-parser'),
    Home               = require('./models/home'),
    User               = require('./models/user'),
    flash              = require('connect-flash'),
    Stuff              = require('./models/stuff'),
    localSrategy       = require('passport-local'),
    methodOverride     = require('method-override'),
    session            = require('express-session'),
    connect            = require('connect-session')
    // ROUTES
    // BE = Back-End
    BE          = require('./back-end_Routes'),
    authRoutes  = require('./routes/auth'),
    homeRoutes  = require('./routes/home'),
    stuffRoutes = require('./routes/stuff');

// mongodb://localhost:27017/bety
mongoose.connect(process.env.DATABASEURL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then( () => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set('view engine', 'ejs') // For .ejs files
app.use(flash())

// PASSPORT Configuration
passport.use(new localSrategy(User.authenticate()));
{
// passport.use('local-signup', new localSrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback : true 
// },(req, username, password, done) => {

//     User.findOne({email: username}, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) {
//              return done(null, false, { message: 'Incorrect username.' });
//          }
//         // if (!user.validPassword(password)) {
//         //      return done(null, false, { message: 'Incorrect password.' });
//         // }
//         return done(null, user);
//     })
// }));
}
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(require('express-session')({
    secret: 'This text used to serialize ',
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
// app.use(connect.session({ secret: 'SUPER SECRET', cookie: { maxAge: 86400000 }}))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true
}));
// A way to path a data to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next()
})

app.get('/', (req, res) => {
    res.render('index')
})

// ROUTES
// Back-End route
app.use('/be', BE)
// ROUTES
app.use('/au', authRoutes);
app.use('/homes', homeRoutes);
app.use('/stuffs', stuffRoutes);

//================================================

const {
    PORT = 3000
} = process.env

app.listen(PORT , process.env.IP, () => console.log('SERVER IS LISTENING ==> ' + `http://localhost:${PORT}`))
