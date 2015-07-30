'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    function(){

        return {

            loadVideo: function(){
                var video = new $.BigVideo({container: $('#background-video'), useFlashForFirefox:false});
                video.init();
                video.show('assets/videos/leaves.mp4', {ambient: true});
            }

        };

    }
]);