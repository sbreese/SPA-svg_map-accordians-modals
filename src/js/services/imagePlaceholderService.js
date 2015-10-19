'use strict';

// TODO: this service is strictly for testing purposes only. This should be deleted once we have real hotel image URLs
angular.module('MarriottBreaks').factory('imagePlaceholderService', [
    function(){

        // Min/Max image sizes
        var minWidth = 200;
        var maxWidth = 400;
        var minHeight = 100;
        var maxHeight = 400;

        var widthRange = maxWidth - minWidth;
        var heightRange = maxHeight - minHeight;

        function getRandomPlaceholder(){
            var width = Math.floor(Math.random() * (widthRange + 1)) + minWidth;
            var height = Math.floor(Math.random() * (heightRange + 1)) + minHeight;

            //return ["http://placekitten.com/", width, '/', height].join('');
            return "assets/images/Sample_Hotel_Card.png";
        }

        return {

            setPlaceholderImagesForBreaks: function(breaks){
                for (var i = 0, l = breaks.length; i < l; i++){
                    breaks[i].IMAGE = getRandomPlaceholder();
                }
            }

        };

    }
]);