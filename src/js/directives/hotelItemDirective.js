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
                    hotel: '='
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

            $scope.getButtonClass = function(){
                // use different button type if this is a top destination
                if ($scope.hotel.TOP_DESTINATION){
                    return 'top-destination-book-now-button';
                }
                else {
                    return 'hotel-item-book-now';
                }
            };

        }
    ]);