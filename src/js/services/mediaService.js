'use strict';

angular.module('MarriottBreaks').factory('mediaService', [
    '$rootScope',
    '$window',
    '$timeout',
    'mediaQueries',
    function ($rootScope, $window, $timeout, mediaQueries) {
        var resizeTimeoutPromise = null;
        var resizeTimeoutDuration = 500;

        // send a resize event when the window is resized. This is to allow many different items plug into this one
        // event - rather than having multiple bindings with different timeouts
        angular.element($window).on('resize', function () {
            if (resizeTimeoutPromise) {
                $timeout.cancel(resizeTimeoutPromise);
            }

            resizeTimeoutPromise = $timeout(function () {
                $rootScope.$emit('window.resize');
            }, resizeTimeoutDuration);
        });

        return {

            isSmallOnly: function () {
                return (mediaQueries.small() && !mediaQueries.medium() && !mediaQueries.large());
            },

            isMediumDown: function () {
                return ((mediaQueries.small() || mediaQueries.medium()) && !mediaQueries.large());
            },

            isMobile: function () {
                // for now, just check medium down. but we may need to change this in the future
                return this.isMediumDown();
            }

        };

    }
]);