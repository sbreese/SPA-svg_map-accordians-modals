'use strict';

angular.module('MarriottBreaks')
    .directive('stickyHeader', [
        '$document',
        '$timeout',
        '$rootScope',
        function ($document, $timeout, $rootScope) {

            var STICKY_OFFSET = 85; // offset of element when in "sticky" mode - should match .sticky-header's CSS top property

            function linkFunction(scope, element, attrs) {
                // scroll offset when the input becomes sticky
                var scrollThreshold;

                // find the internal input element to get it's position
                var inputElement = element.find('input');

                // set initial scroll threshold
                setScrollThreshold();

                // watch for window resize to recalculate when the element should stick
                $rootScope.$on('window.resize', function(){
                    setScrollThreshold();
                });

                $document.on('scroll', function(){
                    updateStickyState();
                });

                function setScrollThreshold(){
                    // set the threshold for when the element will become sticky - essentially happens once the input
                    // reaches the top, so use the input's top offset
                    // do this in a timeout so elements have time to adjust
                    $timeout(function(){
                        var newThreshold = inputElement.offset().top - STICKY_OFFSET;

                        // if the threshold changed, set the new threshold and update sticky state
                        if (scrollThreshold !== newThreshold){
                            scrollThreshold = newThreshold;
                            updateStickyState();
                        }
                    }, 100);

                }

                function updateStickyState(){
                    // add/remove sticky class based on scroll position
                    if ($document.scrollTop() >= scrollThreshold){
                        element.addClass('sticky-header');
                    }
                    else {
                        element.removeClass('sticky-header');
                    }
                }
            }

            return {
                restrict: 'A',
                link: linkFunction
            };
        }
    ]);