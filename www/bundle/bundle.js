'use strict';

var app = angular.module('newtube', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '../views/home.html',
        controller: 'homeCtrl'
    });
    $urlRouterProvider.otherwise('/');
});
'use strict';

app.controller('homeCtrl', function ($scope) {});
'use strict';

app.directive('player', function () {
    return {
        restrict: 'E',
        templateUrl: '../directives/player.html',
        link: function link(scope, elem, attrs) {
            var mediaPlayer;
            mediaPlayer = document.getElementById('video');
            console.log(mediaPlayer);
            mediaPlayer.controls = false;
            var seekBar = document.getElementById("seek-bar");
            var playbtn = document.getElementById('play-pause-button');
            var mutebtn = document.getElementById('mute-button');
            var volControl = document.getElementById('vol-control');

            scope.changeButtonType = function (btn, value) {
                btn.title = value;
                btn.innerHTML = value;
                btn.className = value;
            };

            var seekBarActive = false;
            seekBar.addEventListener("mousedown", function () {
                seekBarActive = true;
            });
            seekBar.addEventListener("mouseup", function () {
                seekBarActive = false;
                // scope.changeButtonType(playbtn, "Play");
                $("#play-pause-button").removeClass('fa-pause');
                $("#play-pause-button").addClass('fa-play');
                mediaPlayer.pause();
            });

            seekBar.addEventListener("mousemove", function () {
                if (seekBarActive == true) {
                    // Calculate the new time
                    var time = mediaPlayer.duration * (seekBar.value / 100);
                    // Update the video time
                    mediaPlayer.currentTime = time;
                }
            });

            volControl.addEventListener("mouseup", function () {
                mediaPlayer.volume = volControl.value / 100;
            });

            mediaPlayer.addEventListener("timeupdate", function () {
                if (mediaPlayer.ended) {
                    // scope.changeButtonType(playbtn, "Play")
                    $("#play-pause-button").removeClass('fa-pause');
                    $("#play-pause-button").addClass('fa-refresh');
                }
                // Calculate the slider value
                var value = 100 / mediaPlayer.duration * mediaPlayer.currentTime;
                // Update the slider value
                seekBar.value = value;
            });

            scope.togglePlayPause = function () {
                if (mediaPlayer.paused || mediaPlayer.ended) {
                    // scope.changeButtonType(playbtn, 'Pause');
                    $("#play-pause-button").removeClass('fa-play');
                    $("#play-pause-button").addClass('fa-pause');
                    mediaPlayer.play();
                } else {
                    // scope.changeButtonType(playbtn, "Play");
                    $("#play-pause-button").removeClass('fa-pause');
                    $("#play-pause-button").addClass('fa-play');
                    mediaPlayer.pause();
                }
            };
            scope.restartPlayer = function () {
                mediaPlayer.pause();
                mediaPlayer.currentTime = 0;
            };
            scope.toggleMute = function () {
                if (mediaPlayer.muted) {
                    scope.changeButtonType(mutebtn, 'Mute');
                    mediaPlayer.muted = false;
                } else {
                    scope.changeButtonType(mutebtn, 'Un-Mute');
                    mediaPlayer.muted = true;
                }
            };
            scope.goFullscreen = function (id) {
                var element = document.getElementById(id);
                if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                }
            };
        }
    };
});
//# sourceMappingURL=bundle.js.map
