'use strict';

angular.module('MarriottBreaks').controller('homeCtrl', [
    '$scope',
    'breaksService',
    function($scope, breaksService){

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