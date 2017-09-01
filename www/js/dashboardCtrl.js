app.controller('dashboardCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.vidid = $stateParams.id;
    $scope.getUser = function() {
        videoSrvc.getUser().then(function(user) {
            $scope.user = user.data;
            $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
            $scope.getVidsByUser($scope.user);
        })
    }
    $scope.getVidsByUser = function(user) {
        videoSrvc.getVidsByUser(user.userid).then(function(videos) {
            $scope.videos = videos.data;
        })
    }
    $scope.getUser();
});