'use strict';

angular.module('MarriottBreaks')
    .directive('hotelItemContainer', [
        function () {

            return {
                restrict: 'EA',
                scope: {
                    isOpen: '='
                },
                controller: 'hotelItemContainerCtrl'
            };

        }
    ])
    .controller('hotelItemContainerCtrl', [
        '$scope',
        '$window',
        function ($scope, $window) {

            // Alias reference to this controller
            var _this = this;
            var hotelItems = [];

            // Set heights if this group just opened
            $scope.$watch('isOpen', function(isOpen){
               if (isOpen){
                   _this.setItemHeights();
               }
            });

            // add hotel element to the list
            _this.addHotelItem = function(hotelItem){
                hotelItems.push(hotelItem);
            };

            // remove hotel element
            _this.removeHotelItem = function(hotelItem){
                var index = hotelItems.indexOf(hotelItem);
                if (index !== -1){
                    hotelItems.splice(index, 1);
                }
            };

            // recalculates all heights for hotel items in this container
            _this.setItemHeights = function(){
                resetHeights();

                var height = calculateMaxHeight();
                // Elements may be hidden. Don't set heights if so
                if (height > 0){
                    setHeights(calculateMaxHeight());
                }
            };

            // get the height of the largest element
            function calculateMaxHeight(){
                var maxHeight = 0;
                var hotelItem, hotelItemHeight;

                for (var i = 0, l = hotelItems.length; i < l; i++){
                    hotelItem = hotelItems[i];
                    hotelItemHeight = hotelItem.height();

                    if (hotelItemHeight > maxHeight){
                        maxHeight = hotelItemHeight;
                    }
                }

                return maxHeight;
            }

            // do the actual setting of the heights
            function setHeights(height){
                for (var i = 0, l = hotelItems.length; i < l; i++){
                    hotelItems[i].height(height);
                }
            }

            // reset heights - this allows us to refresh the heights in order to find the largest
            function resetHeights(){
                for (var i = 0, l = hotelItems.length; i < l; i++){
                    hotelItems[i].height('auto');
                }
            }

            // reset heights when window is resized
            angular.element($window).on('resize', function(){
                _this.setItemHeights();
            });

        }
    ]);