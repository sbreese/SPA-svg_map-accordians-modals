'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    '$document',
    '$window',
    '$timeout',
    'breaksService',
    'statesService',
    function($scope, $document, $window, $timeout, breaksService, statesService){
        // Regions will be populated when accordion is built. This allows us to open/close via code
        // Example item: $scope.regionAccordionGroups['MIDWEST'] = {isOpen: false}
        $scope.regionAccordionGroups = {};
        // Manually add the top destinations group here
        $scope.regionAccordionGroups.TOPDEST = {isOpen: true};

        // Add statesService to the scope so we can use it in binding
        $scope.statesService = statesService;

        $scope.regionButtonClick = function(region){
            expandRegion(region);
        };

        $scope.stateButtonClick = function(state){
            // Expand the region and scroll to the state
            var region = breaksService.getRegionFromState($scope.regions, state);
            if (region){
                expandRegion(region);
            }
            scrollToElement('STATE_' + state);
        };

        // Scroll to the clicked group
        $scope.accordionHeaderClicked = function(region){
            scrollToElement('REGION_' + region);
        };

        $scope.formatRegionName = function(region){
            var regionFormatted = region.toLowerCase();
            return regionFormatted.charAt(0).toUpperCase() + regionFormatted.slice(1);
        };

        function initialize(){
            breaksService.get().then(getBreaksSuccess, getBreaksFail);
        }

        // Animated scroll the the selected element
        function scrollToElement(elementId){
            var element = $window.document.getElementById(elementId);
            if (element){
                $timeout(function(){
                    $document.scrollToElementAnimated(element);
                }, 50);
            }
        }

        function expandRegion(region){
            if ($scope.regionAccordionGroups.hasOwnProperty(region)){
                $scope.$apply($scope.regionAccordionGroups[region].isOpen = true);
            }
        }

        function getBreaksSuccess(data){
            $scope.breaks = data.breaks;
            $scope.regions = data.regions;
        }

        function getBreaksFail(response){
            //TODO: Error handling?
        }

        initialize();

    }
]);