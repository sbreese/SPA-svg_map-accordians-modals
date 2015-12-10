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

        function hideKeyboard() {
            var inputs = document.querySelectorAll('input');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].blur();
            }
        }

        function scrollToElementById(elementId, offset){
            var element = angular.element($document).find(elementId);
            if (element.length > 0) {
                scrollToElement(element, offset);
                setTimeout(function(){ hideKeyboard();}, 1000);
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
                // replace spaces and &'s with underscore
                var regionId = '#REGION_' + region.replace(/["& ]+/g, '_');
                scrollToElementById(regionId);
            },

            scrollToState: function(state){
                scrollToElementById('#STATE_' + state.replace(/ /g,"_").replace('.',''));
            }

        };

    }
]);