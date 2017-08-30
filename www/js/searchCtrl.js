app.controller('searchCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getResults = function() {
        console.log($stateParams);
        videoSrvc.getVideoByQuery($stateParams.searchQuery).then(function(results) {
            // console.log(results.data);
            $scope.results = results.data;
        });
    }
    $scope.getResults();
});