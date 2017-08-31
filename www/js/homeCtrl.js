app.controller('homeCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getNewest = function() {
        videoSrvc.getNewest().then(function(videos) {
            $scope.newestVids = videos.data;
            console.log($scope.newestVids);
        })
    }

    $scope.getUser = function() {
        videoSrvc.getUser().then(function(user) {
            if (user) {
                $scope.user = user.data;
                console.log($scope.user)
            }
        })
    }

    $scope.getUser();
    $scope.getNewest();
});