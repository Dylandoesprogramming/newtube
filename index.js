const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const cors = require('cors');
const massive = require('massive');
const gulp = require('gulp');
const formidable = require('formidable');
const config = require("./config");
const homeCtrl = require("./controllers/homeCtrl")
const app = module.exports = express();
// let database
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    resave: true, //Without this you get a constant warning about default values
    saveUninitialized: true, //Without this you get a constant warning about default values
    secret: config.secret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('www'));
massive(config.connectionString).then(db => {
    app.set('db', db)
        // database = app.get('db');
})

passport.use(new Auth0Strategy({
        domain: config.auth0.domain,
        clientID: config.auth0.clientID,
        clientSecret: config.auth0.clientSecret,
        callbackURL: '/auth/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        console.log(profile)
            //Find user in database
        const db = app.get('db');
        // console.log(profile);
        db.getUserByAuthId([profile.id], function(err, user) {
            console.log('Working')
            user = user[0];
            if (!user) { //if there isn't one, we'll create one!
                console.log('CREATING USER');
                db.createUserByAuth([profile.displayName, profile.id], function(err, user) {
                    console.log('USER CREATED', user);
                    return done(err, user[0]); // GOES TO SERIALIZE USER
                })
            } else { //when we find the user, return it
                console.log('FOUND USER', user);
                return done(err, user);
            }
        });
    }
));

//THIS IS INVOKED ONE TIME TO SET THINGS UP
passport.serializeUser(function(userA, done) {
    console.log('serializing', userA);
    var userB = userA;
    //Things you might do here :
    //Serialize just the id, get other information to add to session, 
    done(null, userB); //PUTS 'USER' ON THE SESSION
});

//USER COMES FROM SESSION - THIS IS INVOKED FOR EVERY ENDPOINT
passport.deserializeUser(function(userB, done) {
    var userC = userB;
    //Things you might do here :
    // Query the database with the user id, get other information to put on req.user
    done(null, userC); //PUTS 'USER' ON REQ.USER
});

app.get('/auth', passport.authenticate('auth0'));


//**************************//
//To force specific provider://
//**************************//
// app.get('/login/google',
//   passport.authenticate('auth0', {connection: 'google-oauth2'}), function (req, res) {
//   res.redirect("/");
// });

app.get('/auth/callback',
    passport.authenticate('auth0', { successRedirect: '/' }),
    function(req, res) {
        res.status(200).send(req.user);
    })

app.get('/auth/me', function(req, res) {
    if (!req.user) return res.sendStatus(404);
    //THIS IS WHATEVER VALUE WE GOT FROM userC variable above.
    res.status(200).send(req.user);
})

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
})


app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/www/index.html');
})

app.post('/', function(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function(name, file) {
        file.path = __dirname + '/www/uploads/' + file.name;
    });

    form.on('file', function(name, file) {
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/www/index.html');
});


app.get('/dashboard/video', homeCtrl.getAnalytics);
app.get('/video/:id', homeCtrl.getComments);
app.get("/search", homeCtrl.getUsers);
app.listen(3001, () => console.log('listening port 3001'));