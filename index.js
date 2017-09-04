const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const cors = require('cors');
const massive = require('massive');
const gulp = require('gulp');
const formidable = require('formidable');
const fs = require('fs');
// const config = require("./config");
const homeCtrl = require("./controllers/homeCtrl")
const app = module.exports = express();
const connectionString = process.env.DATABASE_URL;
const auth0 = {
    domain: 'dylandoesprogramming.auth0.com',
    clientID: 'EOBs2CF6oMfdla6DteAcrEPY19CtKV66',
    clientSecret: 'E1FPOjWBpMkMiDRBbTSSttQwskNoFV6gmsWTWpzaHHmdnbYItPV0QP_9TTN-4WbX'
};
app.use(cors());
app.use(bodyParser.json());
app.use(session({
    resave: true, //Without this you get a constant warning about default values
    saveUninitialized: true, //Without this you get a constant warning about default values
    secret: process.env.secret
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('www'));
massive(connectionString).then(db => {
    app.set('db', db)
        // data = app.get('db');
})

passport.use(new Auth0Strategy({
        domain: auth0.domain,
        clientID: auth0.clientID,
        clientSecret: auth0.clientSecret,
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
    res.send(req.user.user)
})

app.get('/auth/logout', function(req, res) {
    req.logout();
    res.redirect('https://dylandoesprogramming.auth0.com/v2/logout?returnTo=https%3A%2F%2Fnewtubeheroku.herokuapp.com/');
    console.log(req.user)
})

app.get('/upload', function(req, res, next) {
    res.sendFile(__dirname + '/www/index.html');
})

app.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req);
    // console.log("REQ: " + req.body);

    if (req.user) {
        var userId = req.user.user.userid;
        console.log('User Found')
        form.on('fileBegin', function(name, file) {
            console.log("FORM RECEIVED: " + form)
            if (file.name.indexOf('.mp4') > 0 || file.name.indexOf('.MP4') > 0) {
                console.log('file is mp4')
                var checkName = function() {
                    app.get('db').getVideoByName(file.name).then(function(video) {
                        console.log("got videos by name");
                        if (video[0]) {
                            console.log(video[0])
                            if (video[0].filename == file.name && file.name.indexOf('.mp4')) {
                                console.log("renaming video")
                                file.name = file.name.slice(0, file.name.length - 4);
                                file.name = file.name + "re";
                                file.name = file.name + ".mp4";
                            } else if (video[0].filename == file.name) {
                                console.log("renaming video")
                                file.name = file.name.slice(0, file.name.length - 4);
                                file.name = file.name + "re";
                                file.name = file.name + ".MP4";
                            }
                            return checkName();
                        }

                        console.log('setting path')
                        form.uploadDir = __dirname + '/www/uploads/'
                        fs.rename(file.path, form.uploadDir + "/" + file.name, function(err) {
                            console.log("ERROR: " + err);
                        });
                        app.get('db').createVideo(file.name, "../www/uploads/" + file.name, new Date(), userId, "blank", file.name, "../img/thumb.png");

                    });
                }

                checkName()
            } else {
                console.log("NOT A VIDEO!");
            }
        });

        form.on('file', function(name, file) {
            console.log(file.name)
            console.log('Uploaded ' + file.name);
        });
        app.get('db').getRecent(userId)
        res.redirect("/#!/dashboard/upload");
    } else {
        console.log("NOT LOGGED IN!")
        res.redirect("/auth")
            // res.status(400).send('Not Logged In!')
    }
});


app.get('/dashboard/video/:id/analytics', homeCtrl.getAnalytics);
app.get('/video/:id/getvideo', homeCtrl.getVideo);
app.get('/video/CountByDate', homeCtrl.getVideosByDate);
app.get('/video/:id/getcomments', homeCtrl.getComments);
app.get('/videos/:id', homeCtrl.getVidsByUser);
app.get("/search/searchQuery", homeCtrl.searchVideos);
app.get("/users/:id", homeCtrl.getUserById)
app.get("/users/:id/recent", homeCtrl.getRecent)
app.post('/video/:id/comments', homeCtrl.postComment)
app.put('/video/:id/getvideo/title', homeCtrl.changeTitle);
app.put('/video/:id/getvideo/descr', homeCtrl.changeDescr);
app.put('/video/:id/update', homeCtrl.updateVideo);
app.delete('/video/:id/getvideo', homeCtrl.deleteVideo);

app.get('/file-upload', function(req, res) {
    res.sendFile(__dirname + '/www/index.html');
});

app.post('/file-upload/:id', function(req, res) {

    var form = new formidable.IncomingForm();
    form.parse(req);
    if (req.user) {
        var userId = req.user.user.userid;
        console.log('User Found')
        form.on('fileBegin', function(name, file) {
            if (file.name.indexOf('.png') > 0 || file.name.indexOf('.PNG') > 0) {
                console.log('file is png')
                var checkName = function() {
                    var checkFile = "../img/" + file.name;
                    app.get('db').getVideoByThumb(checkFile).then(function(video) {
                        console.log("got videos by thumb");
                        // console.log(video);
                        if (video[0]) {
                            // console.log(video[0])
                            console.log(video[0].thumbnail + ":" + checkFile);
                            if (video[0].thumbnail == checkFile && file.name.indexOf('.png')) {
                                console.log("renaming img")
                                file.name = file.name.slice(0, file.name.length - 4);
                                file.name = file.name + "re";
                                file.name = file.name + ".png";
                            } else if (video[0].thumbnail == checkFile) {
                                console.log("renaming img")
                                file.name = file.name.slice(0, file.name.length - 4);
                                file.name = file.name + "re";
                                file.name = file.name + ".PNG";
                            }
                            return checkName();
                        }

                        console.log('setting path')
                        form.uploadDir = __dirname + '/www/img/'
                        fs.rename(file.path, form.uploadDir + "/" + file.name, function(err) {
                            console.log("ERROR: " + err);
                        });
                        app.get('db').changeThumbnail(req.params.id, "../img/" + file.name).then(function(video) {
                            video[0].vidlink = video[0].vidlink.replace("../www/", "../");
                            res.status(200).send();
                        });
                    });
                }

                checkName()
            } else {
                console.log("NOT A IMAGE!");
            }
        });

        form.on('file', function(name, file) {
            console.log(file.name)
            console.log('Uploaded ' + file.name);
        });

        res.redirect("/#!/dashboard");
    } else {
        console.log("NOT LOGGED IN!")
        res.redirect("/auth")
            // res.status(400).send('Not Logged In!')
    }
});

// app.listen(3001, () => console.log('listening port 3001'));
app.listen(process.env.PORT, () => console.log('listening port 3001'));