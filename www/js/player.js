app.directive('player', function() {
    return {
        restrict: 'E',
        templateUrl: '../directives/player.html',
        scope: {
            // seconds: "="
        },
        controller: function($scope) {
            // var mediaPlayer;
            // mediaPlayer = document.getElementById('video');
            // $scope.seconds = 0;
            // while (!mediaPlayer.paused) {
            //     $scope.seconds = mediaPlayer.currentTime;
            // }
        },
        link: function(scope, elem, attrs) {
            var mediaPlayer;
            mediaPlayer = document.getElementById('video');
            console.log(mediaPlayer);
            mediaPlayer.controls = false;
            var seekBar = document.getElementById("seek-bar");
            var playbtn = document.getElementById('play-pause-button');
            var mutebtn = document.getElementById('mute-button');
            var volControl = document.getElementById('vol-control');
            var curVol = volControl.value;
            var fullscreen = false;
            scope.seconds = 0;

            scope.changeButtonType = function(btn, value) {
                btn.title = value;
                btn.innerHTML = value;
                btn.className = value;
            };

            var seekBarActive = false;
            seekBar.addEventListener("mousedown", function() {
                seekBarActive = true;
                mediaPlayer.pause();
            });
            seekBar.addEventListener("mouseup", function() {
                seekBarActive = false;
                // scope.changeButtonType(playbtn, "Play");
                $("#play-pause-button").removeClass('fa-pause');
                $("#play-pause-button").addClass('fa-play');
                mediaPlayer.pause();
            });

            seekBar.addEventListener("mousemove", function() {
                if (seekBarActive == true) {
                    // Calculate the new time
                    var time = mediaPlayer.duration * (seekBar.value / 100);
                    // Update the video time
                    mediaPlayer.currentTime = time;
                }
            });

            volControl.addEventListener("mouseup", function() {
                mediaPlayer.volume = volControl.value / 100;
                if (volControl.value > 1) {
                    $("#mute-button").removeClass('fa-volume-off');
                    $("#mute-button").addClass('fa-volume-up');
                } else {
                    $("#mute-button").removeClass('fa-volume-up');
                    $("#mute-button").addClass('fa-volume-off');
                }
            })

            mediaPlayer.addEventListener("timeupdate", function() {
                if (mediaPlayer.ended) {
                    // scope.changeButtonType(playbtn, "Play")
                    $("#play-pause-button").removeClass('fa-pause');
                    $("#play-pause-button").addClass('fa-refresh');
                }
                // Calculate the slider value
                var value = (100 / mediaPlayer.duration) * mediaPlayer.currentTime;
                // Update the slider value
                if (!seekBarActive) {
                    seekBar.value = value;
                }
                scope.$apply(function() {
                    scope.seconds = 0;
                    scope.seconds = mediaPlayer.currentTime;
                    console.log(scope.seconds)
                })
            });

            scope.togglePlayPause = function() {
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
            }
            scope.restartPlayer = function() {
                mediaPlayer.pause();
                mediaPlayer.currentTime = 0;
            };
            scope.toggleMute = function() {
                if (mediaPlayer.muted) {
                    $("#mute-button").removeClass('fa-volume-off');
                    $("#mute-button").addClass('fa-volume-up');
                    mediaPlayer.muted = false;
                    volControl.value = curVol;
                } else {
                    $("#mute-button").removeClass('fa-volume-up');
                    $("#mute-button").addClass('fa-volume-off');
                    curVol = volControl.value;
                    volControl.value = 0;
                    mediaPlayer.muted = true;
                }
            }
            scope.goFullscreen = function(id) {
                var element = document.getElementById(id);
                if (!fullscreen) {
                    if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                        fullscreen = true;
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                        fullscreen = true;
                    }
                } else {
                    document.getElementsByTagName('video')[0].webkitExitFullScreen();
                    fullscreen = false;
                }
            }

            scope.updateSecs = function() {
                scope.seconds = mediaPlayer.currentTime;
            }
        }
    }
})