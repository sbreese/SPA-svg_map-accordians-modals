'use strict';

angular.module('MarriottBreaks')
    .directive('map', [
        function () {

            function linkFunction(scope, element, attrs) {
                // Check if SVG Doc has loaded. If so, initialize. Otherwise, we need to wait for it to finish loading
                if (element[0].getSVGDocument()) {
                    init();
                }
                else {
                    element.on('load', init);
                }

                function init() {
                    // Get the root svg and bind a click event to it. This should be better for performance than
                    // binding to each state individually
                    var mapRoot = angular.element(element[0].getSVGDocument().querySelector('svg'));

                    if (mapRoot) {
                        mapRoot.on('click', stateClickFunction);
                        scope.$apply(scope.mapRoot = mapRoot);
                    }

                }

                function stateClickFunction($event) {
                    var stateClicked = scope.getStateFromElement($event.target);

                    if (stateClicked) {
                        scope.stateClickAction({state: stateClicked});
                    }
                }

                function getStateFromElement(element) {
                    if (element.id) {
                        // IDs are in the "US-{state}" format ("US-MI"). If it follows this format, just return the state part
                        var idSplit = element.id.split('-');

                        if (idSplit.length === 2 && idSplit[0] === 'US') {
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
                controller: 'mapCtrl',
                scope: {
                    stateClickAction: '&',
                    regions: '='
                },
                link: linkFunction
            };
        }
    ])
    .controller('mapCtrl', [
        '$scope',
        '$window',
        '$element',
        'breaksService',
        function ($scope, $window, $element, breaksService) {

            $scope.$watch('mapRoot', function (newValue) {
                buildMapData();
            });

            $scope.$watch('regions', function (newValue) {
                buildMapData();
            });

            $scope.getStateFromElement = function (element) {
                if (element.id) {
                    // IDs are in the "US-{state}" format ("US-MI"). If it follows this format, just return the state part
                    // Text elements are "TEXT-MI" format
                    var idSplit = element.id.split('-');

                    if (idSplit.length === 2 && (idSplit[0] === 'US' || idSplit[0] === 'TEXT')) {
                        return idSplit[1];
                    }
                }

                return null;
            };

            function buildMapData() {

                // there is no way to know whether the regions have loaded or the map has been built first.
                // wait for both of them to be ready and then build the map data
                if ($scope.regions && $scope.mapRoot) {
                    var stateData = breaksService.getStates($scope.regions);
                    var statePathElements = $scope.mapRoot[0].querySelectorAll('.land');

                    // loop through each state path and add the breaks count
                    var stateCount, statePathElement, stateName;
                    for (var i = 0, l = statePathElements.length; i < l; i++) {
                        statePathElement = statePathElements[i];
                        stateName = $scope.getStateFromElement(statePathElement);

                        if (stateName) {
                            stateCount = stateData[stateName];

                            if (stateCount) {
                                // add the text element to the map
                                addStateCountElement(statePathElement, stateCount, stateName);
                            }
                        }
                    }
                }
            }

            function addStateCountElement(statePathElement, stateCount, stateName){
                var boundingBox = statePathElement.getBBox();
                var textElement = $window.document.createElementNS("http://www.w3.org/2000/svg", "text");

                textElement.textContent = stateCount; // set the text value

                // set position to the middle of the path
                textElement.setAttribute("transform", "translate(" + (boundingBox.x + boundingBox.width / 2) + " " + (boundingBox.y + boundingBox.height / 2) + ")");
                textElement.setAttribute("fill", "black");
                textElement.setAttribute("font-size", "20");
                textElement.setAttribute("class", "land-text");
                textElement.setAttribute("pointer-events", "none"); // ignore mouse events since state itself is clickable
                textElement.setAttribute("id", "TEXT-" + stateName); // set ID as "TEXT-{STATE}"

                statePathElement.parentNode.insertBefore(textElement, statePathElement.nextSibling);
            }

        }
    ]);