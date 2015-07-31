'use strict';

angular.module('MarriottBreaks')
    .directive('hotelItem', [
        function () {

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/hotelItem.html',
                scope: {
                    hotel: '='
                },
                controller: 'hotelItemCtrl'
            };
        }
    ])
    .controller('hotelItemCtrl', [
        '$scope',
        function ($scope) {

            $scope.getButtonClass = function(){
                if ($scope.hotel.TOP_DESTINATION){
                    return 'top-destination-book-now-button';
                }
                else {
                    return 'hotel-item-book-now';
                }
            }

        }
    ]);