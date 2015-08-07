'use strict';

// place this directive on a typeahead to open the list on focus. Requires an ng-model to be set on the element
angular.module('MarriottBreaks')
    .directive('typeaheadAutoOpen', [
        function () {

            function linkFunction(scope, element, attr, model) {

                element.on('focus', function () {
                    var parsers = model.$parsers;

                    if (parsers){
                        for(var i = 0, l = parsers.length; i < l; i++){
                            parsers[i](model.$viewValue);
                        }
                    }
                });

            }

            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {
                  selectedBreak: '='
                },
                link: linkFunction
            };
        }
    ]);