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
            url: "/video/" + id + "/getvideo/title",
            data: {
                title: title
            }
        })
    }

    this.changeDescr = function(id, descr) {
        console.log("doing a put request on descr");
        return $http({
            method: "Put",
            url: "/video/" + id + "/getvideo/descr",
            data: {
                descr: descr
            }
        })
    }
    this.deleteVideo = function(id) {
        return $http({
            method: "Delete",
            url: "/video/" + id + "/getvideo",
        })
    }
    this.getUserById = function(id) {
        return $http({
            method: "Get",
            url: "/users/" + id,
        })
    }

    this.getRecent = function(id) {
        return $http({
            method: "Get",
            url: "/users/" + id + "/recent",
        })
    }
    this.postFile = function(data) {
        return $http.post("/upload", data, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        })
    }
    this.updateVideo = function(id, title, descr) {
        return $http({
            method: "Put",
            url: "/video/" + id + "/update",
            data: {
                title: title,
                descr: descr
            }
        })
    }
});