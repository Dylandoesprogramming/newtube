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
            .state('search', {
                url: '/search?searchQuery',
                templateUrl: '../views/search.html',
                controller: 'searchCtrl',
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: '../views/dashboard.html',
                controller: 'dashboardCtrl',
            })
            .state('dashvideos', {
                url: '/dashboard/video/:id',
                templateUrl: '../views/dashvideos.html',
                controller: 'dashVidCtrl',
            })
            .state('upload', {
                url: '/dashboard/upload',
                templateUrl: '../views/upload.html',
                controller: 'uploadCtrl',
            })

        $urlRouterProvider.otherwise('/')
    });