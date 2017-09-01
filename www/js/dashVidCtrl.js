app.controller('dashVidCtrl', function($scope, $stateParams, $state, videoSrvc) {
    $scope.vidid = $stateParams.id;
    $scope.getUser = function() {
        videoSrvc.getUser().then(function(user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                $scope.getVideo($scope.vidid);
            }
        })
    }
    $scope.getVideo = function(vidid) {
        console.log("vidid:" + vidid)
        if ($scope.user) {
            videoSrvc.getVideo(vidid).then(function(video) {
                if ($scope.user.userid === video.data[0].userid) {
                    console.log(video);
                    $scope.curVideo = video.data[0];
                    // $scope.curVideo.vidlink = $scope.curVideo.vidlink.replace("../www/", "../")
                    $scope.typedTitle = $scope.curVideo.title;
                    $scope.typedDescr = $scope.curVideo.descr;
                    console.log($scope.curVideo)
                } else {
                    console.log("stop haxor!");
                }
            })
        } else {
            console.log('halt da hax0r');
        }
    }

    $scope.changeTitle = function(title) {
        if ($scope.user) {
            if ($scope.curVideo) {
                if (title) {
                    videoSrvc.changeTitle($scope.vidid, title).then(function(video) {
                        $scope.curVideo = video.data[0];
                        console.log(video);
                        $scope.typedTitle = $scope.curVideo.title;
                        $scope.typedDescr = $scope.curVideo.descr;
                    })
                }
            }
        }
    }

    $scope.changeDescr = function(descr) {
        if ($scope.user) {
            if ($scope.curVideo) {
                if (descr) {
                    videoSrvc.changeDescr($scope.vidid, descr).then(function(video) {
                        $scope.curVideo = video.data[0];
                        console.log(video);
                        $scope.typedTitle = $scope.curVideo.title;
                        $scope.typedDescr = $scope.curVideo.descr;
                    })
                }
            }
        }
    }

    $scope.deleteVideo = function() {
        if ($scope.user) {
            if ($scope.curVideo) {
                var confirmed = window.confirm("You are about to DELETE this video, are you sure?");
                if (confirmed) {
                    videoSrvc.deleteVideo($scope.vidid).then(function() {
                        $state.go('dashboard');
                    })
                }
            }
        }
    }

    $scope.getUser();
});