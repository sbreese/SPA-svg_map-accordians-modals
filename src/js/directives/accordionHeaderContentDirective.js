'use strict';

angular.module('MarriottBreaks')
    .directive('accordionHeaderContent', [
        function () {

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/accordionHeaderContent.html',
                scope: {
                    group: '=',
                    label: '=',
                    isOpen: '='
                },
                controller: 'accordionHeaderContentCtrl',
                replace: true
            };

        }
    ])
    .controller('accordionHeaderContentCtrl', [
        '$scope',
        'scrollService',
        function ($scope, scrollService) {

            $scope.accordionHeaderClicked = function(){
                if (!$scope.isOpen){
                    scrollService.scrollToRegion($scope.group);
                }
            };

        }
    ]);