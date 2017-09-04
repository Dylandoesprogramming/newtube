app.directive('player', function() {
    return {
        restrict: 'E',
        templateUrl: '../directives/player.html',
        link: function(scope, elem, attrs) {
            var mediaPlayer;
            mediaPlayer = document.getElementById('video');
            // console.log(mediaPlayer);
            mediaPlayer.controls = false;
            var seekBar = document.getElementById("seek-bar");
            var playbtn = document.getElementById('play-pause-button');
            var mutebtn = document.getElementById('mute-button');
            var volControl = document.getElementById('vol-control');
            var curVol = volControl.value;
            var fullscreen = false;
            scope.seconds = "0:00";

            var convert = function(seconds) {
                seconds = Number(seconds);
                var hours = Math.floor(seconds / 3600);
                var minutes = Math.floor(seconds % 3600 / 60);
                var seconds = Math.floor(seconds % 3600 % 60);
                return ((hours > 0 ? hours + ":" + (minutes < 10 ? "0" : "") : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
            }

            var seekBarActive = false;
            seekBar.addEventListener("mousedown", function() {
                seekBarActive = true;
                mediaPlayer.pause();
            });
            seekBar.addEventListener("mouseup", function() {
                seekBarActive = false;
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
                    scope.seconds = Math.round(mediaPlayer.currentTime);
                    scope.seconds = convert(scope.seconds);
                    // console.log(scope.seconds)
                })
            });

            $('body').keyup(function(e) {
                // if (e.keyCode == 32) { //on pressing space
                //     scope.togglePlayPause();
                // }

                if (e.keyCode == 37) { //on pressing left arrow
                    mediaPlayer.currentTime = mediaPlayer.currentTime - 1;
                }

                if (e.keyCode == 39) { //on pressing right arrow
                    mediaPlayer.currentTime = mediaPlayer.currentTime + 1;
                }
            })

            $('#player').focus(function() {
                $('#player').keyup(function(e) {
                    if (e.keyCode == 32) {
                        scope.togglePlayPause();
                    }
                })
            })

            scope.togglePlayPause = function() {
                if (mediaPlayer.paused || mediaPlayer.ended) {
                    $("#play-pause-button").removeClass('fa-play');
                    $("#play-pause-button").addClass('fa-pause');
                    mediaPlayer.play();
                } else {
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
                    $("#play-pause-button").css('font-size', '48px');
                    $("#play-pause-button").css('bottom', '0px');
                    $("#fullscreen").css('font-size', '48px');
                    $("#fullscreen").css('bottom', '0px');
                    $("#play-pause-button").css('width', '50px');
                    $("#play-pause-button").css('height', '50px');
                    $("#fullscreen").css('width', '50px');
                    $("#fullscreen").css('height', '50px');

                } else {
                    document.getElementsByTagName('video')[0].webkitExitFullScreen();
                    fullscreen = false;
                    $("#play-pause-button").css('font-size', '24px');
                    $("#play-pause-button").css('bottom', '0px');
                    $("#fullscreen").css('font-size', '24px');
                    $("#fullscreen").css('bottom', '0px');
                    $("#play-pause-button").css('width', '25px');
                    $("#play-pause-button").css('height', '25px');
                    $("#fullscreen").css('width', '25px');
                    $("#fullscreen").css('height', '25px');
                }

            }

            scope.updateSecs = function() {
                scope.seconds = mediaPlayer.currentTime;
            }
        }
    }
})