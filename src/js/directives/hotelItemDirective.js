'use strict';

angular.module('MarriottBreaks')
    .directive('hotelItem', [
        function () {

            function linkFunction(scope, element, attrs, hotelItemContainerCtrl) {
                element.addClass('hotel-item');

                // if we have a parent hotel-item-container, add this item to it's list
                if (hotelItemContainerCtrl !== null){
                    hotelItemContainerCtrl.addHotelItem(element);

                    // Recalculate heights once the image loads
                    var hotelImage = element.find('img');
                    if (hotelImage){
                        hotelImage.on('load', function(){
                            hotelItemContainerCtrl.setItemHeightsForHotelGroup(element);
                        });
                    }
                }

                // remove this item when the directive gets removed
                element.on('$destroy', function() {
                    if (hotelItemContainerCtrl){
                        hotelItemContainerCtrl.removeHotelItem(element);
                    }
                });
            }

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/hotelItem.html',
                scope: {
                    hotel: '=',
                    topDestination: '='
                },
                controller: 'hotelItemCtrl',
                link: linkFunction,
                require: '?^^hotelItemContainer'
            };
        }
    ])
    .controller('hotelItemCtrl', [
        '$scope',
        function ($scope) {

            // prefix ID with 'TD_' if this is a top destination so that it doesn't clash with its duplicate
            // we can't set this on the hotel model itself since it is shared between top dest and normal regions
            $scope.hotelId = ($scope.topDestination ? 'TD_' : '') + $scope.hotel.PROFILE_KEY;

        }
    ]);