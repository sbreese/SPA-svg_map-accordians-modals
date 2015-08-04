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
        '$rootScope',
        'mediaService',
        function ($scope, $rootScope, mediaService) {

            // Alias reference to this controller
            var _this = this;

            // Group hotel items by row. Group count will change depending on screen size
            var hotelGroupCount = null;
            var hotelGroups = [];
            var enableResize = true; // disabled on small views with one column of hotels

            // Set heights if this group just opened
            $scope.$watch('isOpen', function (isOpen) {
                if (isOpen && enableResize) {
                    setAllGroupsItemHeights();
                }
            });

            $rootScope.$on('window.resize', function () {
                updateHotelGroupCount();

                // if resize is enabled and this group is open, resize all groups
                if (enableResize && $scope.isOpen) {
                    setAllGroupsItemHeights();
                }
            });

            // add hotel element to the list
            _this.addHotelItem = function (hotelItem) {
                var hotelGroup;

                // create a new hotel group if this is the first item
                if (hotelGroups.length === 0) {
                    hotelGroup = [];
                    hotelGroups.push(hotelGroup);
                }
                else {
                    // check to see if we reached the group limit for the current group. If so, create a new one
                    hotelGroup = hotelGroups[hotelGroups.length - 1];
                    if (hotelGroup.length >= hotelGroupCount) {
                        hotelGroup = [];
                        hotelGroups.push(hotelGroup);
                    }
                }

                // finally, add the hotel item to the current group
                hotelGroup.push(hotelItem);
            };

            _this.removeHotelItem = function (hotelItem) {
                var hotelGroup, hotelIndex;

                for (var g = 0, gl = hotelGroups.length; g < gl; g++) {
                    hotelGroup = hotelGroups[g];

                    // if the hotel is part of this group, remove it from the group and exit the loop
                    hotelIndex = hotelGroup.indexOf(hotelItem);
                    if (hotelIndex !== -1) {
                        hotelGroup.splice(hotelIndex, 1);
                        break;
                    }
                }

                // if we have a hotel group and the length is 0, remove the group altogether
                if (hotelGroup && hotelGroup.length === 0) {
                    var hotelGroupIndex = hotelGroups.indexOf(hotelGroup);
                    if (hotelGroupIndex !== -1) {
                        hotelGroups.splice(hotelGroupIndex, 1);
                    }
                }
            };

            // recalculates all heights for hotel items in this container
            _this.setItemHeightsForHotelGroup = function (hotel) {
                if (enableResize) {
                    var hotelGroup = getHotelGroupForHotel(hotel);

                    // this shouldn't ever be null, but check just in case
                    if (hotelGroup) {
                        calculateAndSetGroupHeights(hotelGroup);
                    }
                }
            };

            function initialize() {
                updateHotelGroupCount();
            }

            function updateHotelGroupCount() {
                var previousGroupCount = hotelGroupCount;

                if (mediaService.isSmallOnly()) {
                    hotelGroupCount = 1;
                }
                else if (mediaService.isMediumDown()) {
                    hotelGroupCount = 3;
                }
                else {
                    hotelGroupCount = 4;
                }

                // only enable resizing if we have more than one column
                enableResize = (hotelGroupCount > 1);

                // if this isn't the first group count update, we may need to rebuild the groups due to screen size changing
                if (previousGroupCount && previousGroupCount !== hotelGroupCount) {
                    rebuildHotelGroups();
                }
            }

            function rebuildHotelGroups() {
                var allHotels = [];
                var hotelItem;

                for (var g = 0, gl = hotelGroups.length; g < gl; g++) {
                    allHotels = allHotels.concat(hotelGroups[g]);
                }

                // reset the hotel group array
                hotelGroups = [];

                for (var h = 0, hl = allHotels.length; h < hl; h++) {
                    hotelItem = allHotels[h];

                    _this.addHotelItem(hotelItem);
                    // if resize is disabled, set the height to auto for the hotel
                    if (!enableResize) {
                        hotelItem.height('auto');
                    }
                }
            }

            // find the hotel group that this hotel belongs to
            function getHotelGroupForHotel(hotel) {
                var hotelGroup;

                for (var g = 0, gl = hotelGroups.length; g < gl; g++) {
                    hotelGroup = hotelGroups[g];

                    if (hotelGroup.indexOf(hotel) !== -1) {
                        return hotelGroup;
                    }
                }

                return null;
            }

            function setAllGroupsItemHeights() {
                for (var i = 0, l = hotelGroups.length; i < l; i++) {
                    calculateAndSetGroupHeights(hotelGroups[i]);
                }
            }

            function calculateAndSetGroupHeights(hotelGroup) {
                resetGroupElementHeights(hotelGroup);

                var height = calculateGroupHeight(hotelGroup);
                // Elements may be hidden. Don't set heights if so
                if (height > 0) {
                    setGroupElementHeights(hotelGroup, height);
                }
            }

            // get the height of the largest element in the hotel group
            function calculateGroupHeight(hotelGroup) {
                var maxHeight = 0;
                var hotelItem, hotelItemHeight;

                for (var i = 0, l = hotelGroup.length; i < l; i++) {
                    hotelItem = hotelGroup[i];
                    hotelItemHeight = hotelItem.height();

                    if (hotelItemHeight > maxHeight) {
                        maxHeight = hotelItemHeight;
                    }
                }

                return maxHeight;
            }

            // do the actual setting of the heights
            function setGroupElementHeights(hotelGroup, height) {
                for (var i = 0, l = hotelGroup.length; i < l; i++) {
                    hotelGroup[i].height(height);
                }
            }

            // reset heights - this allows us to refresh the heights in order to find the largest
            function resetGroupElementHeights(hotelGroup) {
                for (var i = 0, l = hotelGroup.length; i < l; i++) {
                    hotelGroup[i].height('auto');
                }
            }

            initialize();

        }
    ]);