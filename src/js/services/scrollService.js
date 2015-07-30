'use strict';

angular.module('MarriottBreaks').factory('scrollService', [
    '$window',
    '$document',
    '$timeout',
    function($window, $document, $timeout){

        return {

            // Do an animated scroll to the given element
            scrollToElement: function(elementId){
                var element = $window.document.getElementById(elementId);
                if (element){
                    $timeout(function(){
                        $document.scrollToElementAnimated(element);
                    }, 50);
                }

            }

        };

    }
]);