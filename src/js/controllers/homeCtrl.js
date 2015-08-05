'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    '$document',
    '$timeout',
    'breaksService',
    'statesService',
    'scrollService',
    'mediaService',
    'backgroundVideoService',
    'cookieService',
    function($scope, $rootScope, $window, $document, $timeout, breaksService, statesService, scrollService, mediaService, backgroundVideoService, cookieService){
        $scope.isMobile = mediaService.isMobile();

        // Regions will be populated when accordion is built. This allows us to open/close via code
        // Example item: $scope.regionAccordionGroups['MIDWEST'] = {isOpen: false}
        $scope.regionAccordionGroups = {};
        // Manually add the top destinations group here
        $scope.regionAccordionGroups.TOPDEST = {isOpen: true};

        // Add statesService to the scope so we can use it in binding
        $scope.statesService = statesService;

        // Region Views
        $scope.REGION_VIEWS = {
            LIST: 'LIST',
            MAP: 'MAP'
        };

        if ($scope.isMobile){
            $scope.selectedRegionView = $scope.REGION_VIEWS.LIST;
            $scope.showRegionOptions = false;
        }
        else {
            // Only allow map view if not mobile
            $scope.selectedRegionView = $scope.REGION_VIEWS.MAP;
            $scope.showRegionOptions = true;
        }

        $scope.selectedTopDestination = null;

        $scope.selectRegionView = function(viewType){
            $scope.selectedRegionView = viewType;
        };

        $scope.toggleTopDestination = function(topDestination){
            // Collapse the item if it is already selected
            var topDestinationResult = ($scope.selectedTopDestination === topDestination) ? null : topDestination;
            selectTopDestination(topDestinationResult);
        };

        $scope.isRegionViewActive = function(viewType){
            return $scope.selectedRegionView === viewType;
        };

        $scope.inputItemSelected = function($model){
            if ($model){
                // Some of the marriott pages take a while to navigate to. Disable the search box until then
                $scope.disableSearch = true;
                $window.location.href = $model.PROPERTY_PAGE_URL;
            }
        };

        $scope.regionButtonClick = function(region){
            expandRegion(region);
        };

        $scope.stateButtonClick = function(state){
            // Expand the region and scroll to the state
            var region = breaksService.getRegionFromState($scope.regions, state);
            if (region){
                expandRegion(region);
            }
            scrollService.scrollToState(state);
        };

        // Scroll to the clicked group
        $scope.accordionHeaderClicked = function(region){
            scrollService.scrollToRegion(region);
        };

        $scope.formatRegionName = function(region){
            var regionFormatted = region.toLowerCase();
            return regionFormatted.charAt(0).toUpperCase() + regionFormatted.slice(1);
        };

        // clear input on "pageshow" event. This is due to bfcache (back/forward caching). Otherwise, if bfcache is enabled,
        // the input state will be kept and will stay disabled
        angular.element($window).bind('pageshow', function(){
            $scope.$apply(function(){
                $scope.selectedBreak = null;
                $scope.disableSearch = false;
            });
        });

        $rootScope.$on('window.resize', function () {
            updateMediaOptions();
        });

        var attemptedScroll = false;
        $scope.$watchCollection('regionAccordionGroups', function(newVal){
            // wait until region groups have been built via the DOM ng-repeat before trying to scroll to the hotel items
            if (!attemptedScroll && Object.keys(newVal).length > 1){
                attemptedScroll = true;
                goToLastVisitedItem();
            }
        });


        function initialize(){
            breaksService.get().then(getBreaksSuccess, getBreaksFail);
        }

        // update controller options based on media size
        function updateMediaOptions(){
            $scope.isMobile = mediaService.isMobile();

            if ($scope.isMobile){
                $scope.showRegionOptions = false;

                // if we are changing from mobile to non-mobile, we need to move off of the map view
                if ($scope.selectedRegionView === $scope.REGION_VIEWS.MAP){
                    $scope.selectedRegionView = $scope.REGION_VIEWS.LIST;
                }

                backgroundVideoService.hideVideo();
            }
            else {
                $scope.showRegionOptions = true;
                backgroundVideoService.showVideo();
            }
        }

        function selectTopDestination(topDestination){
            $scope.selectedTopDestination = topDestination;
        }

        function expandRegion(region){
            if ($scope.regionAccordionGroups.hasOwnProperty(region)){
                $scope.regionAccordionGroups[region].isOpen = true;
            }
        }

        function getBreaksSuccess(response){
            $scope.breaks = response.data.breaks;
            $scope.regions = response.data.regions;
            $scope.topDestinations = response.data.topDestinations;
        }

        function getBreaksFail(response){
            //TODO: Error handling?
        }

        function goToLastVisitedItem(){
            var lastVisitedHotel = cookieService.getLastVisitedHotel();

            if (lastVisitedHotel){

                // try to expand the section containing the hotel. this needs to happen first, especially for top destinations
                // because top dests aren't loaded in the DOM yet
                if (expandLastVisitedHotelSection(lastVisitedHotel)){

                    // we need a timeout here so that DOM content can load after expanding
                    $timeout(function(){

                        // try to find the hotel in the DOM
                        var hotelElement = $document.find('#' + lastVisitedHotel.id);

                        // if we find the hotel element, scroll to it
                        if (hotelElement.length > 0){
                            scrollService.scrollToElement(hotelElement, 10);
                        }
                        else {
                            // we couldn't find the exact hotel, so scroll to the next most relevant section
                            if (lastVisitedHotel.topDestination){
                                // for top destination, just scroll to the top destinations section
                                scrollService.scrollToRegion('TOPDEST');
                            }
                            else {
                                // for regular destinations, first try to scroll to the state. If we can't find that,
                                // just scroll to the region
                                var stateElement = $document.find('#STATE_' + lastVisitedHotel.state);
                                if (stateElement.length > 0){
                                    scrollService.scrollToElement(stateElement);
                                }
                                else {
                                    scrollService.scrollToRegion(lastVisitedHotel.region);
                                }
                            }
                        }
                    }, 1000);
                }

                //remove the cookie so that it only happens once
                cookieService.removeLastVisitedHotel();
            }
        }

        // expand the correct hotel section to allow scrolling to it. returns true if the valid section was found and expanded
        function expandLastVisitedHotelSection(lastVisitedHotel){
            if (lastVisitedHotel.topDestination){
                // for top destination, expand the top destination group and open the correct section
                // check to see if this is a valid top destination first
                if ($scope.topDestinations.indexOf(lastVisitedHotel.topDestination) !== -1){
                    $scope.regionAccordionGroups.TOPDEST.isOpen = true;
                    selectTopDestination(lastVisitedHotel.topDestination);

                    return true;
                }
            }
            else {
                // make sure this is a valid region before trying to expand
                if ($scope.regionAccordionGroups.hasOwnProperty(lastVisitedHotel.region)){
                    expandRegion(lastVisitedHotel.region);
                    return true;
                }
            }

            return false;
        }

        initialize();

    }
]);