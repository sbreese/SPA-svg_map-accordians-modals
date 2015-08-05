'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    'mediaService',
    function(mediaService){

        var video = null;
        var videoPlayer = null;
        var playbackRate = 0.6;

        return {

            loadVideo: function(){
                // don't allow video in mobile
                if (video === null && !mediaService.isMobile()){
                    video = new $.BigVideo({container: $('#background-video'), useFlashForFirefox:false});
                    video.init();
                    video.show('assets/videos/leaves.mp4', {ambient: true});

                    videoPlayer = video.getPlayer();
                    videoPlayer.playbackRate(playbackRate);
                }
            },

            hideVideo: function(){
                if (videoPlayer){
                    videoPlayer.hide();
                }
            },

            showVideo: function(){
                if (videoPlayer){
                    videoPlayer.show();
                }
            }

        };

    }
]);