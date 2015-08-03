'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    'mediaService',
    function(mediaService){

        var videoInitialized = false;
        var playbackRate = 0.6;

        return {

            loadVideo: function(){
                // don't allow video in mobile
                if (!videoInitialized && !mediaService.isMobile()){
                    var video = new $.BigVideo({container: $('#background-video'), useFlashForFirefox:false});
                    video.init();
                    video.show('assets/videos/leaves.mp4', {ambient: true});

                    var player = video.getPlayer();
                    player.playbackRate(playbackRate);

                    videoInitialized = true;
                }
            }

        };

    }
]);