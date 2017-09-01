'use strict';

var app = angular.module('newtube', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '../views/home.html',
        controller: 'homeCtrl'
    }).state('video', {
        url: '/video/:id',
        // params: {
        //     param1: "id"
        // },
        templateUrl: '../views/video.html',
        controller: 'videoCtrl'
    }).state('search', {
        url: '/search?searchQuery',
        templateUrl: '../views/search.html',
        controller: 'searchCtrl'
    }).state('dashboard', {
        url: '/dashboard',
        templateUrl: '../views/dashboard.html',
        controller: 'dashboardCtrl'
    }).state('dashvideos', {
        url: '/dashboard/video/:id',
        templateUrl: '../views/dashvideos.html',
        controller: 'dashVidCtrl'
    }).state('upload', {
        url: '/dashboard/upload',
        templateUrl: '../views/upload.html',
        controller: 'uploadCtrl'
    });

    $urlRouterProvider.otherwise('/');
});
"use strict";

app.controller('dashVidCtrl', function ($scope, $stateParams, $state, videoSrvc) {
    $scope.vidid = $stateParams.id;
    $scope.getUser = function () {
        videoSrvc.getUser().then(function (user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                $scope.getVideo($scope.vidid);
            }
        });
    };
    $scope.getVideo = function (vidid) {
        console.log("vidid:" + vidid);
        if ($scope.user) {
            videoSrvc.getVideo(vidid).then(function (video) {
                if ($scope.user.userid === video.data[0].userid) {
                    console.log(video);
                    $scope.curVideo = video.data[0];
                    // $scope.curVideo.vidlink = $scope.curVideo.vidlink.replace("../www/", "../")
                    $scope.typedTitle = $scope.curVideo.title;
                    $scope.typedDescr = $scope.curVideo.descr;
                    console.log($scope.curVideo);
                } else {
                    console.log("stop haxor!");
                }
            });
        } else {
            console.log('halt da hax0r');
        }
    };

    $scope.changeTitle = function (title) {
        if ($scope.user) {
            if ($scope.curVideo) {
                if (title) {
                    videoSrvc.changeTitle($scope.vidid, title).then(function (video) {
                        $scope.curVideo = video.data[0];
                        console.log(video);
                        $scope.typedTitle = $scope.curVideo.title;
                        $scope.typedDescr = $scope.curVideo.descr;
                    });
                }
            }
        }
    };

    $scope.changeDescr = function (descr) {
        if ($scope.user) {
            if ($scope.curVideo) {
                if (descr) {
                    videoSrvc.changeDescr($scope.vidid, descr).then(function (video) {
                        $scope.curVideo = video.data[0];
                        console.log(video);
                        $scope.typedTitle = $scope.curVideo.title;
                        $scope.typedDescr = $scope.curVideo.descr;
                    });
                }
            }
        }
    };

    $scope.deleteVideo = function () {
        if ($scope.user) {
            if ($scope.curVideo) {
                var confirmed = window.confirm("You are about to DELETE this video, are you sure?");
                if (confirmed) {
                    videoSrvc.deleteVideo($scope.vidid).then(function () {
                        $state.go('dashboard');
                    });
                }
            }
        }
    };

    $scope.getUser();
});
'use strict';

app.controller('dashboardCtrl', function ($scope, $stateParams, videoSrvc) {
    $scope.vidid = $stateParams.id;
    $scope.getUser = function () {
        videoSrvc.getUser().then(function (user) {
            $scope.user = user.data;
            $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
            $scope.getVidsByUser($scope.user);
        });
    };
    $scope.getVidsByUser = function (user) {
        videoSrvc.getVidsByUser(user.userid).then(function (videos) {
            $scope.videos = videos.data;
        });
    };
    $scope.getUser();
});
'use strict';

app.controller('homeCtrl', function ($scope, $stateParams, videoSrvc) {
    $scope.getNewest = function () {
        videoSrvc.getNewest().then(function (videos) {
            $scope.newestVids = videos.data;
            console.log($scope.newestVids);
        });
    };

    $scope.getUser = function () {
        videoSrvc.getUser().then(function (user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                console.log($scope.user);
            }
        });
    };

    $scope.getUser();
    $scope.getNewest();
});
'use strict';

app.directive('player', function () {
    return {
        restrict: 'E',
        templateUrl: '../directives/player.html',
        link: function link(scope, elem, attrs) {
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

            var convert = function convert(seconds) {
                seconds = Number(seconds);
                var hours = Math.floor(seconds / 3600);
                var minutes = Math.floor(seconds % 3600 / 60);
                var seconds = Math.floor(seconds % 3600 % 60);
                return (hours > 0 ? hours + ":" + (minutes < 10 ? "0" : "") : "") + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
            };

            var seekBarActive = false;
            seekBar.addEventListener("mousedown", function () {
                seekBarActive = true;
                mediaPlayer.pause();
            });
            seekBar.addEventListener("mouseup", function () {
                seekBarActive = false;
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
                if (volControl.value > 1) {
                    $("#mute-button").removeClass('fa-volume-off');
                    $("#mute-button").addClass('fa-volume-up');
                } else {
                    $("#mute-button").removeClass('fa-volume-up');
                    $("#mute-button").addClass('fa-volume-off');
                }
            });

            mediaPlayer.addEventListener("timeupdate", function () {
                if (mediaPlayer.ended) {
                    $("#play-pause-button").removeClass('fa-pause');
                    $("#play-pause-button").addClass('fa-refresh');
                }
                // Calculate the slider value
                var value = 100 / mediaPlayer.duration * mediaPlayer.currentTime;
                // Update the slider value
                if (!seekBarActive) {
                    seekBar.value = value;
                }
                scope.$apply(function () {
                    scope.seconds = 0;
                    scope.seconds = Math.round(mediaPlayer.currentTime);
                    scope.seconds = convert(scope.seconds);
                    // console.log(scope.seconds)
                });
            });

            $('body').keyup(function (e) {
                // if (e.keyCode == 32) { //on pressing space
                //     scope.togglePlayPause();
                // }

                if (e.keyCode == 37) {
                    //on pressing left arrow
                    mediaPlayer.currentTime = mediaPlayer.currentTime - 1;
                }

                if (e.keyCode == 39) {
                    //on pressing right arrow
                    mediaPlayer.currentTime = mediaPlayer.currentTime + 1;
                }
            });

            $('#player').keyup(function (e) {
                if (e.keyCode == 32) {
                    scope.togglePlayPause();
                }
            });

            scope.togglePlayPause = function () {
                if (mediaPlayer.paused || mediaPlayer.ended) {
                    $("#play-pause-button").removeClass('fa-play');
                    $("#play-pause-button").addClass('fa-pause');
                    mediaPlayer.play();
                } else {
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
            };
            scope.goFullscreen = function (id) {
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
            };

            scope.updateSecs = function () {
                scope.seconds = mediaPlayer.currentTime;
            };
        }
    };
});
'use strict';

app.controller('searchCtrl', function ($scope, $stateParams, videoSrvc) {
    $scope.getResults = function () {
        console.log($stateParams);
        videoSrvc.getVideoByQuery($stateParams.searchQuery).then(function (results) {
            $scope.results = results.data;
            $scope.resultCount = $scope.results.length;
        });
    };
    $scope.getUser = function () {
        videoSrvc.getUser().then(function (user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                console.log($scope.user);
            }
        });
    };
    $scope.getUser();
    $scope.getResults();
});
'use strict';

app.directive('topbar', function () {
    return {
        Restrict: 'E',
        templateUrl: '../directives/topbar.html'
    };
});
'use strict';

app.controller('uploadCtrl', function ($scope, $stateParams, $location, videoSrvc) {
    $scope.getUser = function () {
        videoSrvc.getUser().then(function (user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                console.log($scope.user);
                // $scope.getRecent()
            }
        });
    };

    $scope.getRecent = function () {
        console.log('getting recent');
        if ($scope.user) {
            console.log('found user');
            videoSrvc.getRecent($scope.user.userid).then(function (video) {
                console.log('most recent video is:' + video.data[0]);
                if ($scope.curFile) {
                    videoSrvc.updateVideo(video.data[0].vidid, $scope.newTitle, $scope.newDescr).then(function () {
                        console.log('updated video');
                        videoSrvc.getRecent($scope.user.userid).then(function (video) {
                            console.log('new recent video is: ' + video.data[0]);
                            $location.url('/dashboard/video/' + video.data[0].vidid);
                        });
                    });
                }
            });
        }
    };
    $scope.postFile = function () {
        $scope.curFile = document.getElementById('file').files[0];
        if ($scope.curFile) {
            console.log('We gots a file mang');
            console.log($scope.curFile);
            var fd = new FormData();
            fd.append("file", $scope.curFile);
            if ($scope.newTitle && $scope.newDescr) {
                videoSrvc.postFile(fd).then(function () {
                    console.log('finished uploading');
                    $scope.getRecent();
                });
            }
        }
    };
    $scope.getUser();
});
"use strict";

app.controller('videoCtrl', function ($scope, $stateParams, videoSrvc) {
    $scope.showDetails = false;
    $scope.getVideo = function () {
        videoSrvc.getVideo($stateParams.id).then(function (video) {
            $scope.curVideo = video.data[0];
            // $scope.curVideo.vidlink = $scope.curVideo.vidlink.replace("../www/", "../")
            // console.log($scope.curVideo);
        });
    };
    $scope.getUserById = function (id) {
        videoSrvc.getUserById(id).then(function (user) {
            $scope.tempuser = user.data;
        });
    };
    $scope.getComments = function () {
        videoSrvc.getComments($stateParams.id).then(function (comments) {
            // console.log(comments.data);
            $scope.comments = comments.data.reverse();
            for (var i = 0; i < $scope.comments.length; i++) {
                videoSrvc.getUserById($scope.comments[i].userid).then(function (user) {
                    var tempuser = user.data[0];
                    tempuser.username = tempuser.username.charAt(0).toUpperCase() + tempuser.username.slice(1);
                    // console.log(tempuser.username);
                    for (var i = 0; i < $scope.comments.length; i++) {
                        if (tempuser.userid == $scope.comments[i].userid) {
                            $scope.comments[i].username = tempuser.username;
                            console.log($scope.comments[i]);
                        }
                    }
                });
            }
        });
    };
    $scope.subComment = function (comment) {
        if (comment) {
            videoSrvc.sendComment(comment, $stateParams.id).then(function () {
                $scope.getComments();
            });
        }
        $scope.curComment = "";
    };
    $scope.getUser = function () {
        videoSrvc.getUser().then(function (user) {
            if (user) {
                $scope.user = user.data;
                $scope.user.username = $scope.user.username.charAt(0).toUpperCase() + $scope.user.username.slice(1);
                // console.log($scope.user)
            }
        });
    };
    $scope.getUser();
    $scope.getVideo();

    $scope.getComments();
});
"use strict";

app.service('videoSrvc', function ($http) {
    this.getVideo = function (id) {
        console.log(id);
        return $http({
            method: "Get",
            url: "/video/" + id + "/getvideo"
        });
    };
    this.getComments = function (id) {
        return $http({
            method: "Get",
            url: "/video/" + id + "/getcomments"
        });
    };
    this.sendComment = function (comment, id) {
        console.log(comment + ":" + id);
        return $http({
            method: "Post",
            url: "/video/" + id + "/comments",
            data: {
                comment: comment
            }
        });
    };
    this.getVideoByQuery = function (searchQuery) {
        return $http({
            method: "Get",
            url: "/search/searchQuery?searchQuery=" + searchQuery
        });
    };
    this.getNewest = function () {
        return $http({
            method: "Get",
            url: "/video/CountByDate"
        });
    };
    this.getUser = function () {
        return $http({
            method: "Get",
            url: "/me"
        });
    };

    this.getVidsByUser = function (id) {
        return $http({
            method: "Get",
            url: "/videos/" + id + "/"
        });
    };

    this.changeTitle = function (id, title) {
        console.log('doing a put request on title');
        return $http({
            method: "Put",
            url: "/video/" + id + "/getvideo/title",
            data: {
                title: title
            }
        });
    };

    this.changeDescr = function (id, descr) {
        console.log("doing a put request on descr");
        return $http({
            method: "Put",
            url: "/video/" + id + "/getvideo/descr",
            data: {
                descr: descr
            }
        });
    };
    this.deleteVideo = function (id) {
        return $http({
            method: "Delete",
            url: "/video/" + id + "/getvideo"
        });
    };
    this.getUserById = function (id) {
        return $http({
            method: "Get",
            url: "/users/" + id
        });
    };

    this.getRecent = function (id) {
        return $http({
            method: "Get",
            url: "/users/" + id + "/recent"
        });
    };
    this.postFile = function (data) {
        return $http.post("/upload", data, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        });
    };
    this.updateVideo = function (id, title, descr) {
        return $http({
            method: "Put",
            url: "/video/" + id + "/update",
            data: {
                title: title,
                descr: descr
            }
        });
    };
});
//# sourceMappingURL=bundle.js.map
