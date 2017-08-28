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
                res.status(200).send(video)
            })
    },
    postComment: function(req, res, next) {
        const db = req.app.get('db');
        console.log("Posting Comment")
        let userId = req.user.user.userid
        db.postComment(req.body.comment, req.params.id, userId)
            .then(function() {
                console.log("I madeit to resolve");
                res.status(200).send();
            })
    }
}