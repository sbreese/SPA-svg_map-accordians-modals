'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    '$rootScope',
    '$window',
    'breaksService',
    'statesService',
    'scrollService',
    'mediaService',
    'backgroundVideoService',
    function($scope, $rootScope, $window, breaksService, statesService, scrollService, mediaService, backgroundVideoService){
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

        $scope.selectTopDestination = function(topDestination){
            // Collapse the item if it is already selected
            if ($scope.selectedTopDestination === topDestination){
                $scope.selectedTopDestination = null;
            }
            else {
                $scope.selectedTopDestination = topDestination;
            }
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
            scrollService.scrollToElement('#STATE_' + state);
        };

        // Scroll to the clicked group
        $scope.accordionHeaderClicked = function(region){
            scrollService.scrollToElement('#REGION_' + region);
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

        initialize();

    }
]);