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
    this.getVideoByQuery = function(searchQuery) {
        return $http({
            method: "Get",
            url: "/search/searchQuery?searchQuery=" + searchQuery
        });
    }
    this.getNewest = function() {
        return $http({
            method: "Get",
            url: "/video/CountByDate"
        })
    }
    this.getUser = function() {
        return $http({
            method: "Get",
            url: "/me"
        })
    }

    this.getVidsByUser = function(id) {
        return $http({
            method: "Get",
            url: "/videos/" + id + "/"
        })
    }

    this.changeTitle = function(id, title) {
        console.log('doing a put request on title');
        return $http({
            method: "Put",
            url: "/video/" + id + "/getvideo",
            data: {
                title: title
            }
        })
    }
});