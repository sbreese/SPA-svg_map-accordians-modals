'use strict';

angular.module('MarriottBreaks')
    .directive('hotelItem', [
        function () {

            function linkFunction(scope, element, attrs, hotelItemContainerCtrl) {
                element.addClass('hotel-item');

                // get a random image for now
                scope.hotelImage = getRandomPlaceholder();

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

                function getRandomPlaceholder(){
                    var minWidth = 200;
                    var maxWidth = 400;
                    var minHeight = 100;
                    var maxHeight = 400;

                    var widthRange = maxWidth - minWidth;
                    var heightRange = maxHeight - minHeight;

                    var width = Math.floor(Math.random() * (widthRange + 1)) + minWidth;
                    var height = Math.floor(Math.random() * (heightRange + 1)) + minHeight;

                    return ["http://placekitten.com/", width, '/', height].join('');
                }
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
        'cookieService',
        function ($scope, cookieService) {

            // prefix ID with 'TD_' if this is a top destination so that it doesn't clash with its duplicate
            // we can't set this on the hotel model itself since it is shared between top dest and normal regions
            $scope.hotelId = ($scope.topDestination ? 'TD_' : '') + $scope.hotel.PROFILE_KEY;

            $scope.getButtonClass = function(){
                // use different button type if this is a top destination
                if ($scope.hotel.TOP_DESTINATION){
                    return 'top-destination-book-now-button';
                }
                else {
                    return 'hotel-item-book-now';
                }
            };

            $scope.hotelItemSelected = function(){
                // save hotel info in a cookie for when we come back to the site
                cookieService.saveLastVisitedHotel($scope.hotelId, $scope.hotel, $scope.topDestination);
            };

        }
    ]);