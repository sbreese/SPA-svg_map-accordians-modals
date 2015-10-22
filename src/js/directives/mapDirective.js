'use strict';

angular.module('MarriottBreaks')
    .directive('svgmap', [
        'backgroundVideoService',
        function (backgroundVideoService) {

            function linkFunction(scope, element, attrs) {
                // bind to the maps' load event. We need to wait for the svg to be fully loaded before we try
                // to manipulate the SVG data
                element.on('load', init);

                function init() {
                    var mapRoot = angular.element(angular.element(element[0].getSVGDocument()).find('svg'));

                    if (mapRoot) {
                        mapRoot.on('click', stateClickFunction);
                        scope.$apply(scope.mapRoot = mapRoot);
                    }

                    // we need to wait until the map is loaded to load the video, otherwise the height will not be correct
                    // there may be a better way to do this, but I couldn't get it working without waiting for the map to load
                    backgroundVideoService.loadVideo();
                }

                function stateClickFunction($event) {
                    var stateClicked = scope.getStateFromElement($event.target);
                    if (stateClicked) {
                        stateClicked = stateClicked.replace('CARRIBEAN_LATIN_AMERICA', 'CARRIBEAN & LATIN AMERICA').replace(/_/g, ' ');
                        scope.$apply(scope.stateClickAction({state: stateClicked }));
                    }
                }

            }

            return {
                restrict: 'EA',
                templateUrl: 'html/templates/svg_map.html',
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
        'breaksService','mediaService',
        function ($scope, $window, breaksService, mediaService) {

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
                    if (2 in idSplit) {
                        idSplit[1] = idSplit[1] + '-' + idSplit[2];
                    }

                    // To add support for STATE click on map, add these conditions to the following IF statement: idSplit[0] === 'US' || idSplit[0] === 'TEXT' || 
                    if (idSplit[0] === 'regionCircle') {
                        return idSplit[1];
                    }
                }

                return null;
            };

            // Steve's Get Region From Element:
            $scope.getRegionFromElement = function (element) {
                if (element.id) {
                    // IDs are in the "US-{state}" format ("US-MI"). If it follows this format, just return the state part
                    // Text elements are "TEXT-MI" format

                    var idSplit = element.id.split('-'); //element.id.split('-');

                    if (2 in idSplit) {
                        idSplit[1] = idSplit[1] + '-' + idSplit[2];
                    }
                    if (idSplit[0] === 'regionCircle') {
                        return idSplit[1];
                    }
                }

                return null;
            };

            function buildMapData() {

                // there is no way to know whether the regions have loaded or the map has been built first.
                // wait for both of them to be ready and then build the map data
                if ($scope.regions && $scope.mapRoot) {
                    /* UNCOMMENT TO DISPLAY eBREAK COUNT BY STATE ON MAP

                    var stateData = breaksService.getStates($scope.regions);
                    //var statePathElements = angular.element($scope.mapRoot[0]).find('.land');
                    var statePathElements = angular.element($scope.mapRoot[0]).find('.US');

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
                    */
                    if (mediaService.isMobile()) {
                        $scope.mapRoot[0].setAttribute("viewBox", "135 300 1400 1500");
                    }

                    // Steve's Build Region Map Data:
                    var regionData = $scope.regions;
                    var regionPathElements = angular.element($scope.mapRoot[0]).find('.region-circle');

                    // loop through each state path and add the breaks count
                    var regionCount, regionPathElement, regionName, regionNameSpaces;
                    for (var i = 0, l = regionPathElements.length; i < l; i++) {
                        regionPathElement = regionPathElements[i];

                        regionName = $scope.getRegionFromElement(regionPathElement);

                        regionNameSpaces = regionName.replace('CARRIBEAN_LATIN_AMERICA', 'CARRIBEAN & LATIN AMERICA').replace(/_/g, ' ');
                        if (regionName) {
                            if (regionData[regionNameSpaces] && regionData[regionNameSpaces].count) {
                                regionCount = regionData[regionNameSpaces].count;
                                if (regionCount) {
                                    // add the text element to the map
                                    addRegionCountElement(regionPathElement, regionCount, regionName);
                                }
                            }
                            else{
                                addRegionCountElement(regionPathElement, 0, regionName);
                            }
                        }
                    }

                }
            }

            function addStateCountElement(statePathElement, stateCount, stateName){
                // CURRENTLY NOT USED.  ONLY REGION CICLES HAVE CLICK ACTION.
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

            // Steve's Add Region code:
            function addRegionCountElement(regionPathElement, regionCount, regionName){
                var boundingBox = regionPathElement.getBBox();
                var textElement = $window.document.createElementNS("http://www.w3.org/2000/svg", "text");

                var LabelElement = angular.element($scope.mapRoot[0]).find('#text-' + regionName);
                if (typeof LabelElement[0] !== 'undefined') {
                    if (!LabelElement[0].innerHTML) {
                        LabelElement[0].innerHTML = regionCount;
                    }
                }
/*
                var CirlcX, CircleY;

                switch(regionName) {
                    case "CANADA":
                        CirlcX = 1146;
                        CircleY = 891;
                        break;
                    case "PACIFIC":
                        CirlcX = 461;
                        CircleY = 981;
                        break;
                    case "NORTH_CENTRAL":
                        CirlcX = 941;
                        CircleY = 1006;
                        break;
                    case "SOUTH_CENTRAL":
                        CirlcX = 916;
                        CircleY = 1251;
                        break;
                    case "MOUNTAIN":
                        CirlcX = 636;
                        CircleY = 1051;
                        break;
                    case "SOUTHEAST":
                        CirlcX = 1196;
                        CircleY = 1196;
                        break;
                    case "NEW_ENGLAND":
                        CirlcX = 1286;
                        CircleY = 961;
                        break;
                    case "CARRIBEAN_LATIN_AMERICA":
                        CirlcX = 694;
                        CircleY = 1438;
                        break;
                    default:
                    //default code block
                }

                textElement.textContent = regionCount; // set the text value

                // set count position to the middle of the path
                textElement.setAttribute("transform", "translate(" + (CirlcX + 138 / 2 - (regionCount<10?18:35)) + " " + (CircleY + 138 / 2 + 12) + ")");
                textElement.setAttribute("fill", "black");
                textElement.setAttribute("font-size", "50");
                textElement.setAttribute("font-family", "verdana,arial,sans-serif");
                textElement.setAttribute("class", "land-text");
                textElement.setAttribute("pointer-events", "none"); // ignore mouse events since state itself is clickable
                textElement.setAttribute("id", "REGION_TEXT-" + regionName); // set ID as "REGION_TEXT-{REGION}"

                var textElement2 = $window.document.createElementNS("http://www.w3.org/2000/svg", "text");
                textElement2.textContent = "DEALS"; // set the text value

                // set label position to the middle of the path
                textElement2.setAttribute("transform", "translate(" + (CirlcX + 138 / 2 - 27) + " " + (CircleY + 138 / 2 + 38) + ")");
                textElement2.setAttribute("fill", "black");
                textElement2.setAttribute("font-size", "15");
                textElement2.setAttribute("font-family", "verdana,arial,sans-serif");
                textElement2.setAttribute("class", "land-text");
                textElement2.setAttribute("pointer-events", "none"); // ignore mouse events since state itself is clickable
                textElement2.setAttribute("id", "DEAL_TEXT-" + regionName); // set ID as "REGION_TEXT-{REGION}"

                regionPathElement.parentNode.insertBefore(textElement2, regionPathElement.nextSibling).parentNode.insertBefore(textElement, regionPathElement.nextSibling);
                */
            }

        }
    ]);