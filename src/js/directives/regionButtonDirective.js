'use strict';

angular.module('MarriottBreaks')
    .directive('regionButton', [
        function () {

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/regionButton.html',
                scope: {
                    region: '@',
                    action: '&'
                },
                replace: true,
                controller: 'regionButtonCtrl'
            };
        }
    ])
    .controller('regionButtonCtrl', [
        '$scope',
        function ($scope) {

            $scope.regionUppercase = $scope.region.toUpperCase();

            $scope.onClick = function(){
                $scope.action({region: $scope.regionUppercase});
            };

        }
    ]);