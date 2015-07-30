'use strict';

angular.module('MarriottBreaks').factory('backgroundVideoService', [
    function(){

        return {

            loadVideo: function(){
                var video = new $.BigVideo({container: $('#background-video')});
                video.init();
                video.show('http://vjs.zencdn.net/v/oceans.mp4', {ambient: true});
            }

        };

    }
]);