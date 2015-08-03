'use strict';

angular.module('MarriottBreaks').factory('breaksService', [
    '$http',
    function ($http) {

        return {
            get: function () {
                return $http.get('breaks');
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
            }
        };
    }
]);