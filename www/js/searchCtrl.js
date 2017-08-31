app.controller('searchCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getResults = function() {
        console.log($stateParams);
        videoSrvc.getVideoByQuery($stateParams.searchQuery).then(function(results) {
            // console.log(results.data);
            $scope.results = results.data;
        });
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
    $scope.getResults();
});