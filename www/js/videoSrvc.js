app.service('videoSrvc', function($http) {
    this.getVideo = function(id) {
        console.log(id);
        return $http({
            method: "Get",
            url: "/video/" + id + "/getvideo",
        })
    }
    this.getComments = function(id) {
        return $http({
            method: "Get",
            url: "/video/" + id + "/getcomments"
        })
    }
    this.sendComment = function(comment, id) {
        console.log(comment + ":" + id)
        return $http({
            method: "Post",
            url: "/video/" + id + "/comments",
            data: {
                comment: comment
            }
        });
    }
});