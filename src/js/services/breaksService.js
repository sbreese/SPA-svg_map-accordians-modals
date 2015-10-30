'use strict';

angular.module('MarriottBreaks').factory('breaksService', [
    '$http',
    function ($http) {

        return {
            get: function () {
                //return $http.get('assets/data/marriott-data.json');
                return $http.get('assets/data/marriott-data.json', { headers: { 'Cache-Control' : 'no-cache' } });
            },

            getRegionFromState: function(regions, state){
                var region;

                // search through the region groups until we find our region
                for (var regionName in regions){
                    if (regions.hasOwnProperty(regionName)){
                        region = regions[regionName];
                        for (var stateName in region.states){
                            if (stateName === state && region.states.hasOwnProperty(stateName)){
                                return regionName;
                            }
                        }
                    }
                }

                return null;
            },

            getStates: function(regions){
                var states = {};
                var region;

                // search through the region groups until we find our region
                for (var regionName in regions){
                    if (regions.hasOwnProperty(regionName)){
                        region = regions[regionName];
                        for (var stateName in region.states){
                            if (region.states.hasOwnProperty(stateName)){
                                states[stateName] = region.states[stateName];
                            }
                        }
                    }
                }

                return states;
            },

            // get a list of breaks where the first two zip code values match. i.e. "60618" will match "60***"
            getBreaksWithSimilarZipCode: function(zip, breaks){
                var returnBreaks = [];
                var currentBreak;
                var shortZip = zip.slice(0, 2); // first two digits of the zip code

                for (var i = 0, l = breaks.length; i < l; i++){
                    currentBreak = breaks[i];

                    if (currentBreak.ZIP && currentBreak.ZIP.slice(0, 2) === shortZip){
                        returnBreaks.push(currentBreak);
                    }
                }

                return returnBreaks;
            }
        };
    }
]);