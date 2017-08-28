let app = angular.module('newtube', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '../views/home.html',
                controller: 'homeCtrl',
            })
            .state('video', {
                url: '/video/:id',
                // params: {
                //     param1: "id"
                // },
                templateUrl: '../views/video.html',
                controller: 'videoCtrl',
            })

        $urlRouterProvider.otherwise('/')
    });