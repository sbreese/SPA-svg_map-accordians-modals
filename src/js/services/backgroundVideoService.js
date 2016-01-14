'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    'mediaService','$document','$window',
    function(mediaService, $document, $window){

        var video = null;
        var videoPlayer = null;
        var playbackRate = 0.5;

        return {

            loadVideo: function(){
                // don't allow video in mobile  && !mediaService.isMobile()
                if (video === null && !mediaService.isMobile()){
                    video = new $.BigVideo({container: $('#background-video'), useFlashForFirefox:false});
                    video.init();
                    //video.show('assets/videos/roadtrip.mp4', {ambient: true});
                    video.show('assets/videos/Marriott_eBreaks.mp4', {ambient: true});
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
            },

            updateBackgroundVideoHeight: function(){
                var newHeight;
                if ($window.innerWidth < 350) {
                    newHeight = 600;
                } else if ($window.innerWidth < 400) {
                    newHeight = 580;
                } else if ($window.innerWidth < 450) {
                    newHeight = 560;
                } else if ($window.innerWidth < 500){
                    newHeight = 540;
                } else if ($window.innerWidth < 550){
                    newHeight = 540;
                } else if ($window.innerWidth < 600) {
                    newHeight = 540;
                } else if ($window.innerWidth < 650) {
                    newHeight = 540;
                } else if ($window.innerWidth < 700) {
                    newHeight = 540;
                } else if ($window.innerWidth < 800) {
                    newHeight = 540;
                } else if ($window.innerWidth < 900) {
                    newHeight = 540;
                } else if ($window.innerWidth < 1000) {
                    newHeight = 540;
                } else if ($window.innerWidth < 1100) {
                    newHeight = 540;
                } else if ($window.innerWidth < 1200) {
                    newHeight = 540;
                } else { // > 1200
                    newHeight = 540;
                }

                var videoDiv = $document.find("#background-video");  // Default is min-height: 690px;
                if (videoDiv.height() < newHeight) {
                    videoDiv.height(newHeight);
                }
            }

        };

    }
]);