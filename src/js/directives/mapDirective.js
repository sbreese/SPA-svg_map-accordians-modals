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
                        mapRoot.on('click', stateRegionClickFunction);
                        scope.$apply(scope.mapRoot = mapRoot);
                    }

                    // we need to wait until the map is loaded to load the video, otherwise the height will not be correct
                    // there may be a better way to do this, but I couldn't get it working without waiting for the map to load
                    backgroundVideoService.loadVideo();
                }

                function stateRegionClickFunction($event) {

                    var stateRegionClicked = scope.getRegionStateFromElement($event.target);
                    if (stateRegionClicked) {
                        stateRegionClicked = stateRegionClicked.replace('CARIBBEAN_LATIN_AMERICA', 'CARIBBEAN & LATIN AMERICA').replace(/_/g, ' ');
                        scope.$apply(scope.stateClickAction({state: stateRegionClicked }));
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
                    selectedRegionView: '=',
                    regions: '='
                },
                link: linkFunction
            };
        }
    ])
    .controller('mapCtrl', [
        '$rootScope',
        '$document',
        '$scope',
        '$window',
        'breaksService','mediaService', 'backgroundVideoService',
        function ($rootScope, $document, $scope, $window, breaksService, mediaService, backgroundVideoService) {

            $scope.$watch('mapRoot', function (newValue) {
                buildMapData();
            });

            $scope.$watch('regions', function (newValue) {
                buildMapData();
            });

            angular.element($window).on('resize', function () { // $rootScope.$on  use window.resize if you only want to change when user is done.
                if ($scope.selectedRegionView=='LIST')
                {
                    //updateBackgroundVideoHeight();
                    backgroundVideoService.updateBackgroundVideoHeight();
                }
                else {
                    updateViewBox();
                }
            });

            $scope.getRegionStateFromElement = function (element) {
                if (element.id) {
                    // IDs are in the "US-{state}" format ("US-MI"). If it follows this format, just return the state part
                    // Text elements are "TEXT-MI" format
                    var idSplit = element.id.split('-');
                    if (2 in idSplit) {
                        idSplit[1] = idSplit[1] + '-' + idSplit[2];
                    }

                    // To add support for STATE click on map, add these conditions to the following IF statement: idSplit[0] === 'US' || idSplit[0] === 'TEXT' || 
                    if (idSplit[0] === 'regionCircle' || idSplit[0] === 'US' || idSplit[0] === 'CANADA' || idSplit[0] === 'CARIBBEAN_LATIN_AMERICA') {
                        return (idSplit[1]?idSplit[1]:idSplit[0]);
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

            function updateViewBox() {

                var pushMapRight;
                var pushMapDown;
                var MapWidth;
                var MapHeight;
                var videoDiv = $document.find("#background-video");  // Default is min-height: 690px;
                //alert("Window width: "+ window.innerWidth);
                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                    console.log("Set for FF");
                    if ($window.innerWidth < 350) {
                        pushMapRight = 50;
                        pushMapDown = -15;
                        MapWidth = 590;
                        MapHeight = 800;
                        videoDiv.height(420);
                    } else if ($window.innerWidth < 400) {
                        pushMapRight = 50;
                        pushMapDown = 0;
                        MapWidth = 595;
                        MapHeight = 700;
                        videoDiv.height(450);
                    } else if ($window.innerWidth < 450) {
                        pushMapRight = 50;
                        pushMapDown = 80;
                        MapWidth = 595;
                        MapHeight = 700;
                        videoDiv.height(480);
                    } else if ($window.innerWidth < 500) {
                        pushMapRight = 50;
                        pushMapDown = 150;
                        MapWidth = 595;
                        MapHeight = 700;
                        videoDiv.height(510);
                    } else if ($window.innerWidth < 550) {
                        pushMapRight = 50;
                        pushMapDown = 160;
                        MapWidth = 585;
                        MapHeight = 700;
                        videoDiv.height(530);
                    } else if ($window.innerWidth < 600) {
                        pushMapRight = 40;
                        pushMapDown = 175;
                        MapWidth = 595;
                        MapHeight = 800;
                        videoDiv.height(540);
                    } else if ($window.innerWidth < 650) {
                        pushMapRight = 30;
                        pushMapDown = 185;
                        MapWidth = 620;
                        MapHeight = 850;
                        videoDiv.height(550);
                    } else if ($window.innerWidth < 700) {
                        pushMapRight = 30;
                        pushMapDown = 200;
                        MapWidth = 620;
                        MapHeight = 850;
                        videoDiv.height(560);
                    } else if ($window.innerWidth < 750) {
                        pushMapRight = 30;
                        pushMapDown = 205;
                        MapWidth = 620;
                        MapHeight = 850;
                        videoDiv.height(565);
                    } else if ($window.innerWidth < 800) {
                        pushMapRight = 20;
                        pushMapDown = 210;
                        MapWidth = 630;
                        MapHeight = 875;
                        videoDiv.height(580);
                    } else if ($window.innerWidth < 850) {
                        pushMapRight = 20;
                        pushMapDown = 240;
                        MapWidth = 630;
                        MapHeight = 875;
                        videoDiv.height(600);
                    } else if ($window.innerWidth < 900) {
                        pushMapRight = 10;
                        pushMapDown = 250;
                        MapWidth = 640;
                        MapHeight = 900;
                        videoDiv.height(620);
                    } else if ($window.innerWidth < 950) {
                        pushMapRight = 10;
                        pushMapDown = 260;
                        MapWidth = 640;
                        MapHeight = 900;
                        videoDiv.height(640);
                    } else if ($window.innerWidth < 1000) {
                        pushMapRight = 10;
                        pushMapDown = 270;
                        MapWidth = 650;
                        MapHeight = 900;
                        videoDiv.height(660);
                    } else if ($window.innerWidth < 1100) {
                        pushMapRight = 0;
                        pushMapDown = 235;
                        MapWidth = 670;
                        MapHeight = 1000;
                        videoDiv.height(670);
                    } else if ($window.innerWidth < 1200) {
                        pushMapRight = -22;
                        pushMapDown = 240;
                        MapWidth = 685;
                        MapHeight = 1000;
                        videoDiv.height(680);
                    } else { // > 1200
                        pushMapRight = -25;
                        pushMapDown = 210;
                        MapWidth = 700;
                        MapHeight = 1065;
                        videoDiv.height(690);
                    }
                }
                else {
                    if ($window.innerWidth < 250) {
                        pushMapRight = 50;
                        pushMapDown = -260;
                        MapWidth = 585;
                        MapHeight = 1000;
                        videoDiv.height(400);
                    } else if ($window.innerWidth < 300) {
                        pushMapRight = 50;
                        pushMapDown = -100;
                        MapWidth = 585;
                        MapHeight = 900;
                        videoDiv.height(400);
                    } else if ($window.innerWidth < 350) {
                        pushMapRight = 50;
                        pushMapDown = 0;
                        MapWidth = 585;
                        MapHeight = 800;
                        videoDiv.height(400);
                    } else if ($window.innerWidth < 400) {
                        pushMapRight = 50;
                        pushMapDown = 5;
                        MapWidth = 585;
                        MapHeight = 700;
                        videoDiv.height(440);
                    } else if ($window.innerWidth < 450) {
                        pushMapRight = 50;
                        pushMapDown = 55;
                        MapWidth = 590;
                        MapHeight = 700;
                        videoDiv.height(440);
                    } else if ($window.innerWidth < 500){
                        pushMapRight = 50;
                        pushMapDown = 100;
                        MapWidth = 590;
                        MapHeight = 700;
                        videoDiv.height(470);
                    } else if ($window.innerWidth < 550){
                        pushMapRight = 50;
                        pushMapDown = 140;
                        MapWidth = 590;
                        MapHeight = 700;
                        videoDiv.height(470);
                    } else if ($window.innerWidth < 600) {
                        pushMapRight = 40;
                        pushMapDown = 180;
                        MapWidth = 600;
                        MapHeight = 800;
                        videoDiv.height(500);
                    } else if ($window.innerWidth < 650) {
                        pushMapRight = 30;
                        pushMapDown = 140;
                        MapWidth = 620;
                        MapHeight = 850;
                        videoDiv.height(540);
                    } else if ($window.innerWidth < 700) {
                        pushMapRight = 30;
                        pushMapDown = 180;
                        MapWidth = 620;
                        MapHeight = 850;
                        videoDiv.height(530);
                    } else if ($window.innerWidth < 800) {
                        pushMapRight = 50;
                        pushMapDown = 190;
                        MapWidth = 630;
                        MapHeight = 875;
                        videoDiv.height(570);
                    } else if ($window.innerWidth < 900) {
                        pushMapRight = 10;
                        pushMapDown = 200;
                        MapWidth = 640;
                        MapHeight = 900;
                        videoDiv.height(620);
                    } else if ($window.innerWidth < 950) {
                        pushMapRight = 10;
                        pushMapDown = 220;
                        MapWidth = 640;
                        MapHeight = 900;
                        videoDiv.height(640);
                    } else if ($window.innerWidth < 1000) {
                        pushMapRight = -10;
                        pushMapDown = 237;
                        MapWidth = 650;
                        MapHeight = 1000;
                        videoDiv.height(660);
                    } else if ($window.innerWidth < 1100) {
                        pushMapRight = -20;
                        pushMapDown = 235;
                        MapWidth = 670;
                        MapHeight = 1000;
                        videoDiv.height(670);
                    } else if ($window.innerWidth < 1200) {
                        pushMapRight = -22;
                        pushMapDown = 230;
                        MapWidth = 685;
                        MapHeight = 1000;
                        videoDiv.height(680);
                    } else { // > 1200
                        pushMapRight = -25;
                        pushMapDown = 230;
                        MapWidth = 700;
                        MapHeight = 1065;
                        videoDiv.height(690);
                    }
                }

                    $scope.mapRoot[0].setAttribute("viewBox", pushMapRight + " " + pushMapDown + " " + MapWidth + " " + MapHeight);

            };

            function buildMapData() {

                // there is no way to know whether the regions have loaded or the map has been built first.
                // wait for both of them to be ready and then build the map data
                if ($scope.regions && $scope.mapRoot) {

                    updateViewBox();

                    // Steve's Build Region Map Data:
                    var regionData = $scope.regions;
                    var regionPathElements = angular.element($scope.mapRoot[0]).find('.region-circle');

                    // loop through each state path and add the breaks count
                    var regionCount, regionPathElement, regionName, regionNameSpaces;
                    for (var i = 0, l = regionPathElements.length; i < l; i++) {
                        regionPathElement = regionPathElements[i];

                        regionName = $scope.getRegionFromElement(regionPathElement);

                        regionNameSpaces = regionName.replace('CARIBBEAN_LATIN_AMERICA', 'CARIBBEAN & LATIN AMERICA').replace(/_/g, ' ');
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
                    //if (!LabelElement[0].innerHTML) {
                    //    LabelElement[0].innerHTML = regionCount;  DOES NOT WORK IN SAFARI!
                    // }
                    LabelElement.html(regionCount);
                }

            }

        }
    ]);