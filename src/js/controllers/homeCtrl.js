'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    'breaksService',
    function($scope, breaksService){

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