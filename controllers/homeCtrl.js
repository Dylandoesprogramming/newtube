module.exports = {
    getAnalytics: function(req, res, next) {
        const db = req.app.get('db');
        console.log('Get Analytics');
        db.readAnalytics()
            .then((analytics) => res.status(200).send(analytics))
            .catch((err) => res.status(200).send(err))
    },
    getComments: function(req, res, next) {
        const db = req.app.get('db');
        console.log('Get Comments by vidid');
        db.readComments(req.params.id) //if that doesnt work wrap params in bracket []
            .then((comments) => res.status(200).send(comments))
            .catch((err) => res.status(200).send(err))
    },
    getUsers: function(req, res, next) {
        const db = req.app.get('db');
        console.log("Get Users");
        db.readUsers()
            .then((users) => res.status(200).send(users))
            .catch((err) => res.status(200).send(err))
    },
    getVideo: function(req, res, next) {
        const db = req.app.get('db');
        console.log('Get Video by vidid');
        db.getVideo(req.params.id)
            .then(function(video) {
                console.log(video);
                video[0].vidlink = video[0].vidlink.replace("../www/", "../");
                res.status(200).send(video)
            })
    },
    postComment: function(req, res, next) {
        const db = req.app.get('db');
        if (req.user) {
            console.log("Posting Comment")
            let userId = req.user.user.userid
            db.postComment(req.body.comment, req.params.id, userId)
                .then(function() {
                    res.status(200).send();
                })
        } else {
            console.log("NOT LOGGED IN")
        }
    },
    searchVideos: function(req, res, next) {
        const db = req.app.get('db');
        let searchQuery = req.query.searchQuery;
        console.log(searchQuery);
        searchQuery = "%" + searchQuery + "%";
        db.searchVideos(searchQuery).then((videos) => res.status(200).send(videos))
    },
    getVideosByDate: function(req, res, next) {
        const db = req.app.get('db');
        db.getVideosByDate().then((videos) => res.status(200).send(videos))
    },
    getVidsByUser: function(req, res, next) {
        const db = req.app.get('db');
        db.getVidsByUser(req.params.id).then((videos) => res.status(200).send(videos))
    },
    changeTitle: function(req, res, next) {
        const db = req.app.get('db');
        db.changeTitle(req.params.id, req.body.title).then(function(video) {
            video[0].vidlink = video[0].vidlink.replace("../www/", "../");
            res.status(200).send(video);
        })
    },
    changeDescr: function(req, res, next) {
        const db = req.app.get('db');
        db.changeDescr(req.params.id, req.body.descr).then(function(video) {
            video[0].vidlink = video[0].vidlink.replace("../www/", "../");
            res.status(200).send(video);
        })
    },
    deleteVideo: function(req, res, next) {
        const db = req.app.get('db');
        db.deleteVideo(req.params.id).then(function() {
            res.status(200).send();
        })
    },
    getUserById: function(req, res, next) {
        const db = req.app.get('db');
        db.getUserById(req.params.id).then(function(user) {
            res.status(200).send(user);
        })
    },
    getRecent: function(req, res, next) {
        const db = req.app.get('db');
        db.getRecent(req.params.id).then(function(video) {
            video[0].vidlink = video[0].vidlink.replace("../www/", "../");
            res.status(200).send(video)
        })
    },
    updateVideo: function(req, res, next) {
        const db = req.app.get('db');
        db.changeTitle(req.params.id, req.body.title).then(function() {
            db.changeDescr(req.params.id, req.body.descr).then(function(video) {
                // res.redirect("/#!/dashboard/video/" + req.params.id);
                res.status(200).send();
            })
        })
    }
}