app.controller('videoCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getVideo = function() {
        videoSrvc.getVideo($stateParams.id).then(function(video) {
            $scope.curVideo = video.data[0];
            // $scope.curVideo.vidlink = $scope.curVideo.vidlink.replace("../www/", "../")
            console.log($scope.curVideo);
        })
    }
    $scope.getComments = function() {
        videoSrvc.getComments($stateParams.id).then(function(comments) {
            console.log(comments.data);
            return $scope.comments = comments.data;
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
    $scope.getVideo();

    $scope.getComments();
});