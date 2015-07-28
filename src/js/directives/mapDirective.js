'use strict';

angular.module('MarriottBreaks')
    .directive('map', [
        function () {

            function linkFunction(scope, element, attrs){
                // Check if SVG Doc has loaded. If so, initialize. Otherwise, we need to wait for it to finish loading
                if (element[0].getSVGDocument()){
                    init();
                }
                else {
                    element.on('load', init);
                }

                function init(){
                    // Get the root svg and bind a click event to it. This should be better for performance than
                    // binding to each state individually
                    var mapRoot = angular.element(element[0]
                        .getSVGDocument().querySelectorAll('svg'));

                    if (mapRoot){
                        mapRoot.on('click', stateClickFunction);
                    }
                }

                function stateClickFunction($event){
                    var stateClicked = getStateFromElement($event.target);

                    if (stateClicked){
                        scope.stateClickAction({state: stateClicked});
                    }
                }

                function getStateFromElement(element){
                    if (element.id){
                        // IDs are in the "US-{state}" format ("US-MI"). If it follows this format, just return the state part
                        var idSplit = element.id.split('-');

                        if (idSplit.length === 2 && idSplit[0] === 'US'){
                            return idSplit[1];
                        }
                    }

                    return null;
                }
            }

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/map.html',
                replace: true,
                scope: {
                    stateClickAction: '&'
                },
                link: linkFunction
            };
        }
    ]);