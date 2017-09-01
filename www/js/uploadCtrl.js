app.controller('uploadCtrl', function($scope, $stateParams, $location, videoSrvc) {
    $scope.getUser = function() {
        videoSrvc.getUser().then(function(user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                console.log($scope.user)
                $scope.getRecent()
            }
        })
    }

    $scope.getRecent = function() {
        console.log('getting recent')
        if ($scope.user) {
            console.log('found user')
            videoSrvc.getRecent($scope.user.userid).then(function(video) {
                if ($scope.curFile) {
                    videoSrvc.updateVideo(video.data[0].vidid, $scope.newTitle, $scope.newDescr).then(function() {
                        videoSrvc.getRecent($scope.user.userid).then(function(video) {
                            $location.url('/dashboard/video/' + video.data[0].vidid)
                        })
                    })
                }
            })
        }
    }
    $scope.postFile = function() {
        $scope.curFile = document.getElementById('file').files[0];
        if ($scope.curFile) {
            console.log('We gots a file mang');
            console.log($scope.curFile);
            var fd = new FormData();
            fd.append("file", $scope.curFile);
            if ($scope.newTitle && $scope.newDescr) {
                videoSrvc.postFile(fd).then(function() {
                    $scope.getRecent()
                })
            }
        }
    }
    $scope.getUser();
});