'use strict';

angular.module('MarriottBreaks').directive('hotelItem', [
    function () {

        return {
            restrict: 'EA',
            templateUrl: 'html/templates/hotelItem.html',
            scope: {
                hotel: '='
            }
        };
    }
]);