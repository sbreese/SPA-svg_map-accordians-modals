'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    'mediaService',
    function(mediaService){

        var video = null;
        var videoPlayer = null;
        var playbackRate = 0.5;

        return {

            loadVideo: function(){
                // don't allow video in mobile  && !mediaService.isMobile()
                if (video === null){
                    video = new $.BigVideo({container: $('#background-video'), useFlashForFirefox:false});
                    video.init();
                    //video.show('assets/videos/roadtrip.mp4', {ambient: true});
                    video.show('assets/videos/Marriott_eBreaks_HD720.mp4', {ambient: true});
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