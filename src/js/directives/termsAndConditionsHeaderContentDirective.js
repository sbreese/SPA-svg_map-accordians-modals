'use strict';

angular.module('MarriottBreaks')
    .directive('termsAndConditionsHeaderContent', [
        function () {

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/termsAndConditionsHeaderContent.html',
                scope: {
                    group: '=',
                    label: '=',
                    isOpen: '='
                },
                controller: 'termsAndConditionsHeaderContentCtrl',
                replace: true
            };

        }
    ])
    .controller('termsAndConditionsHeaderContentCtrl', [
        '$scope',
        'scrollService',

        function ($scope, scrollService) {
            $scope.isOpen = false;
        }
    ]);