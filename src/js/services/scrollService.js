'use strict';

angular.module('MarriottBreaks').factory('scrollService', [
    '$document',
    '$timeout',
    function($document, $timeout){

        return {

            // Do an animated scroll to the given element
            scrollToElement: function(elementId){
                var element = angular.element($document).find(elementId);
                if (element){
                    $timeout(function(){
                        $document.scrollToElementAnimated(element);
                    }, 50);
                }

            }

        };

    }
]);