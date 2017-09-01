app.controller('searchCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getResults = function() {
        console.log($stateParams);
        videoSrvc.getVideoByQuery($stateParams.searchQuery).then(function(results) {
            $scope.results = results.data;
            $scope.resultCount = $scope.results.length;
        });
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
    $scope.getResults();
});