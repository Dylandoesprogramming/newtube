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
        // data = app.get('db');
})

passport.use(new Auth0Strategy({
        domain: config.auth0.domain,
        clientID: config.auth0.clientID,
        clientSecret: config.auth0.clientSecret,
        callbackURL: '/auth/callback'
    },
    function(accessToken, refreshToken, extraParams, profile, done) {
        // console.log(profile)
        const db = app.get('db');
        // console.log(profile);
        db.getUserByName([profile.nickname])
            .then(
                function(user) {
                    if (user.length < 1) {
                        db.createUserByName([profile.nickname]).then(function(user) {
                            profile.user = user[0];
                            console.log(user);
                            return done(null, profile);
                        });
                    } else {
                        profile.user = user[0];
                        console.log(user[0]);
                        return done(null, profile);
                    }
                });
    }));


// Start passport authentication with auth0 using Auth0Strategy
// Passport.authenticate will create a req/res function
app.get('/auth', passport.authenticate('auth0'))

//Auth0 returns to this endpoint
// This callback location must match the callbackURL in the Auth0Strategy
app.get('/auth/callback',
    passport.authenticate('auth0', {
        successRedirect: '/',
        failureRedirect: '/auth'
    })
)

// Serialize encodes profile and adds on to session
// This function receives the results of the function in the new instance of Auth0
// Profile is passed on to sessions
passport.serializeUser(function(user, done) {
    done(null, user);
})


// Deserialize decodes profile from session to put on to req.user
passport.deserializeUser(function(user, done) {
    done(null, user)
})

// Return user object from session
app.get('/me', function(req, res) {
    res.send(req.user)
})

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('/');
    console.log(req.user)
})

app.get('/', function(req, res, next) {
    res.sendFile(__dirname + '/www/index.html');
})

app.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    // console.log(userId);
    form.parse(req);
    if (req.user) {
        var userId = req.user.user.userid;
        form.on('fileBegin', function(name, file) {
            // app.get('db').getVideoByName()
            file.path = __dirname + '/www/uploads/' + file.name;
            app.get('db').createVideo(file.name, "../www/uploads/" + file.name, new Date(), userId, "blank");
        });

        form.on('file', function(name, file) {
            console.log('Uploaded ' + file.name);
        });

        res.sendFile(__dirname + '/www/index.html');
    } else {
        console.log("NOT LOGGED IN!")
        res.status(400).send('Not Logged In!')
    }
});


app.get('/dashboard/video', homeCtrl.getAnalytics);
app.get('/video/:id', homeCtrl.getComments);
app.get("/search", homeCtrl.getUsers);
app.listen(3001, () => console.log('listening port 3001'));