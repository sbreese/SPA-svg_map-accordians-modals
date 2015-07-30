'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    function(){

        var videoInitialized = false;

        return {

            loadVideo: function(){
                if (!videoInitialized){
                    var video = new $.BigVideo({container: $('#background-video'), useFlashForFirefox:false});
                    video.init();
                    video.show('assets/videos/leaves.mp4', {ambient: true});

                    videoInitialized = true;
                }
            }

        };

    }
]);