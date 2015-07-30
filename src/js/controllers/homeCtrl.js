'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    '$window',
    'breaksService',
    'statesService',
    'scrollService',
    function($scope, $window, breaksService, statesService, scrollService){
        // Regions will be populated when accordion is built. This allows us to open/close via code
        // Example item: $scope.regionAccordionGroups['MIDWEST'] = {isOpen: false}
        $scope.regionAccordionGroups = {};
        // Manually add the top destinations group here
        $scope.regionAccordionGroups.TOPDEST = {isOpen: true};

        // Add statesService to the scope so we can use it in binding
        $scope.statesService = statesService;

        // Region Views
        $scope.REGION_VIEWS = {
            MAP: 'MAP',
            LIST: 'LIST'
        };

        // TODO: Switch this on mobile, Map is not allowed
        $scope.selectedRegionView = $scope.REGION_VIEWS.MAP;

        $scope.selectRegionView = function(viewType){
            $scope.selectedRegionView = viewType;
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
            scrollService.scrollToElement('STATE_' + state);
        };

        // Scroll to the clicked group
        $scope.accordionHeaderClicked = function(region){
            scrollService.scrollToElement('REGION_' + region);
        };

        $scope.formatRegionName = function(region){
            var regionFormatted = region.toLowerCase();
            return regionFormatted.charAt(0).toUpperCase() + regionFormatted.slice(1);
        };

        // clear input on "pageshow" event. This is due to bfcache (back/forward caching). Otherwise, if bfcache is enabled,
        // the input state will be kept and will stay disabled
        angular.element($window).bind('pageshow', function(){
            $scope.selectedBreak = null;
            $scope.disableSearch = false;
        });

        function initialize(){
            breaksService.get().then(getBreaksSuccess, getBreaksFail);
        }

        function expandRegion(region){
            if ($scope.regionAccordionGroups.hasOwnProperty(region)){
                $scope.regionAccordionGroups[region].isOpen = true;
            }
        }

        function getBreaksSuccess(data){
            $scope.breaks = data.breaks;
            $scope.regions = data.regions;
            $scope.topDestinations = data.topDestinations;
        }

        function getBreaksFail(response){
            //TODO: Error handling?
        }

        initialize();

    }
]);