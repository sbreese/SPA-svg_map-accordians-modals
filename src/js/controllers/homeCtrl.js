'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    '$document',
    '$timeout',
    'breaksService',
    function($scope, $document, $timeout, breaksService){
        // Regions will be populated when accordion is built. This allows us to open/close via code
        // Example item: $scope.regionAccordionGroups['MIDWEST'] = {isOpen: false}
        $scope.regionAccordionGroups = {};
        // Manually add the top destinations group here
        $scope.regionAccordionGroups['TOPDEST'] = {isOpen: true};

        $scope.regionButtonClick = function(region){
            if ($scope.regionAccordionGroups.hasOwnProperty(region)){
                $scope.regionAccordionGroups[region].isOpen = true;
            }
        };

        // Scroll to the clicked group
        $scope.accordionHeaderClicked = function(region){
            var headerId = 'REGION_' + region;

            var headerItem = document.getElementById(headerId);
            if (headerItem){
                $timeout(function(){
                    $document.scrollToElementAnimated(headerItem);
                }, 50);
            }
        };

        $scope.formatRegionName = function(region){
            var regionFormatted = region.toLowerCase();
            return regionFormatted.charAt(0).toUpperCase() + regionFormatted.slice(1);
        };

        function initialize(){
            breaksService.get().then(getBreaksSuccess, getBreaksFail);
        }

        function getBreaksSuccess(breaks){
            $scope.breaks = breaks;
        }

        function getBreaksFail(response){
            //TODO: Error handling?
        }

        initialize();

    }
]);