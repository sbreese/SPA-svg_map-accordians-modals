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

            // build the ID of the region header - replace all spaces and &'s with underscore
            $scope.id = 'REGION_' + $scope.group.replace(/["& ]+/g, '_');

            $scope.accordionHeaderClicked = function(){
                if (!$scope.isOpen){
                    scrollService.scrollToElementById('#' + $scope.id);
                }
            };

        }
    ]);