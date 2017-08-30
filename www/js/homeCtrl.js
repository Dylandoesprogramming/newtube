app.controller('homeCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getNewest = function() {
        videoSrvc.getNewest().then(function(videos) {
            $scope.newest = videos.data;
            console.log($scope.newest);
        })
    }
    $scope.getNewest();
});