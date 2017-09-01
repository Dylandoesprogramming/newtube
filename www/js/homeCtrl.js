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
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                console.log($scope.user)
            }
        })
    }

    $scope.getUser();
    $scope.getNewest();
});