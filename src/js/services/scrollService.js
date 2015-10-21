'use strict';

angular.module('MarriottBreaks').factory('scrollService', [
    '$document',
    '$timeout',
    function ($document, $timeout) {

        var timeoutDuration = 50;

        function scrollToElement(element, offset){
            $timeout(function () {
                $document.scrollToElementAnimated(element, offset);
            }, timeoutDuration);
        }

        function scrollToElementById(elementId, offset){
            var element = angular.element($document).find(elementId);
            if (element.length > 0) {
                scrollToElement(element, offset);
            }
        }

        return {

            // Do an animated scroll to the given element by ID
            scrollToElementById: function (elementId, offset) {
                scrollToElementById(elementId, offset);
            },

            // Do an animated scroll to the given element
            scrollToElement: function (element, offset) {
                scrollToElement(element, offset);
            },

            scrollToRegion: function(region){
                scrollToElementById('#REGION_' + region);
            },

            scrollToState: function(state){
                scrollToElementById('#STATE_' + state.replace(/ /g,"_"));
            }

        };

    }
]);