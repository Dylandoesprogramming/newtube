app.controller('uploadCtrl', function($scope, $stateParams, videoSrvc) {
    $scope.getUser = function() {
        videoSrvc.getUser().then(function(user) {
            if (user) {
                $scope.user = user.data;
                console.log($scope.user)
            }
        })
    }
    $scope.getUser();
});