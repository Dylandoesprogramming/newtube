app.directive('player', function() {
    return {
        restrict: 'E',
        templateUrl: '../directives/player.html',
        link: function(scope, elem, attrs) {
            var mediaPlayer;
            mediaPlayer = document.getElementById('video');
            console.log(mediaPlayer);
            mediaPlayer.controls = false;
            var seekBar = document.getElementById("seek-bar");
            var playbtn = document.getElementById('play-pause-button');
            var mutebtn = document.getElementById('mute-button');

            scope.changeButtonType = function(btn, value) {
                btn.title = value;
                btn.innerHTML = value;
                btn.className = value;
            };

            var seekBarActive = false;
            seekBar.addEventListener("mousedown", function() {
                seekBarActive = true;
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

            mediaPlayer.addEventListener("timeupdate", function() {
                if (mediaPlayer.ended) {
                    // scope.changeButtonType(playbtn, "Play")
                    $("#play-pause-button").removeClass('fa-pause');
                    $("#play-pause-button").addClass('fa-refresh');
                }
                // Calculate the slider value
                var value = (100 / mediaPlayer.duration) * mediaPlayer.currentTime;
                // Update the slider value
                seekBar.value = value;
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
                    scope.changeButtonType(mutebtn, 'Mute');
                    mediaPlayer.muted = false;
                } else {
                    scope.changeButtonType(mutebtn, 'Un-Mute');
                    mediaPlayer.muted = true;
                }
            }
        }
    }
})