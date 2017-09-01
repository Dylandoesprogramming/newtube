app.controller('videoCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.showDetails = false;
    $scope.getVideo = function() {
        videoSrvc.getVideo($stateParams.id).then(function(video) {
            $scope.curVideo = video.data[0];
            // $scope.curVideo.vidlink = $scope.curVideo.vidlink.replace("../www/", "../")
            // console.log($scope.curVideo);
        })
    }
    $scope.getUserById = function(id) {
        videoSrvc.getUserById(id).then(function(user) {
            $scope.tempuser = user.data;
        })
    }
    $scope.getComments = function() {
        videoSrvc.getComments($stateParams.id).then(function(comments) {
            // console.log(comments.data);
            $scope.comments = comments.data.reverse();
            for (var i = 0; i < $scope.comments.length; i++) {
                videoSrvc.getUserById($scope.comments[i].userid).then(function(user) {
                    var tempuser = user.data[0];
                    tempuser.username = tempuser.username.charAt(0).toUpperCase() + tempuser.username.slice(1);
                    // console.log(tempuser.username);
                    for (var i = 0; i < $scope.comments.length; i++) {
                        if (tempuser.userid == $scope.comments[i].userid) {
                            $scope.comments[i].username = tempuser.username;
                            console.log($scope.comments[i]);
                        }
                    }

                })
            }
        })
    }
    $scope.subComment = function(comment) {
        if (comment) {
            videoSrvc.sendComment(comment, $stateParams.id).then(function() {
                $scope.getComments();
            })
        }
        $scope.curComment = "";
    }
    $scope.getUser = function() {
        videoSrvc.getUser().then(function(user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                // console.log($scope.user)
            }
        })
    }
    $scope.getUser();
    $scope.getVideo();

    $scope.getComments();
});