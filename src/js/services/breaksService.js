'use strict';

angular.module('MarriottBreaks').factory('breaksService', [
    '$http',
    '$q',
    function ($http, $q) {

        function formatBreaksData(breaksData){
            var regionGroups = [];

            for (var i = 0, l = breaksData.breaks.length; i < l; i++){
                addHotelToGroup(breaksData.breaks[i], regionGroups);
            }

            breaksData.regionGroups = regionGroups;
            breaksData.topDestinationGroups = buildTopDestinationGroups(breaksData.breaks);
        }

        function buildTopDestinationGroups(breaks){
            var topDestinationGroups = [];

            var hotel, destination, topDestinationGroup;

            for (var i = 0, l = breaks.length; i < l; i++){
                hotel = breaks[i];

                if (hotel.TOP_DESTINATION === 'TRUE'){
                    destination = hotel.MARKET_CITY;

                    topDestinationGroup = getTopDestinationGroup(destination, topDestinationGroups);
                    topDestinationGroup.breaks.push(hotel);
                }
            }

            return topDestinationGroups;
        }

        function addHotelToGroup(hotel, regionGroups){
            // first get the region group
            var regionGroup = getRegionGroup(hotel.REGION, regionGroups);

            // now get the state group
            var stateGroup = getStateGroup(hotel.PROPERTY_STATE, regionGroup);

            stateGroup.breaks.push(hotel);
        }

        function getStateGroup(state, regionGroup){
            var stateGroup;

            for (var i = 0, l = regionGroup.stateGroups.length; i < l; i++){
                stateGroup = regionGroup.stateGroups[i];

                if (stateGroup.state === state){
                    return stateGroup;
                }
            }

            // if we didn't find a matching group, add a new group
            stateGroup = {state: state, breaks: []};
            regionGroup.stateGroups.push(stateGroup);

            return stateGroup;
        }

        function getRegionGroup(region, regionGroups){
            var regionGroup;

            for (var i = 0, l = regionGroups.length; i < l; i++){
                regionGroup = regionGroups[i];

                if (regionGroup.region === region){
                    return regionGroup;
                }
            }

            // if we didn't find a matching group, add a new group
            regionGroup = {region: region, stateGroups: []};
            regionGroups.push(regionGroup);

            return regionGroup;
        }

        function getTopDestinationGroup(destination, topDestinationGroups){
            var topDestinationGroup;

            for (var i = 0, l = topDestinationGroups.length; i < l; i++){
                topDestinationGroup = topDestinationGroups[i];

                if (topDestinationGroup.destination === destination){
                    return topDestinationGroup;
                }
            }

            // add the group if we didn't find an existing one
            topDestinationGroup = {destination: destination, breaks:[]};
            topDestinationGroups.push(topDestinationGroup);

            return topDestinationGroup;
        }

        return {
            get: function () {
                var deferred = $q.defer();

                $http.get('assets/data/marriott-data.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(
                    function(response){
                        formatBreaksData(response.data);
                        deferred.resolve(response);
                    },
                    function(response){
                        deferred.reject(response);
                    }
                );

                return deferred.promise;
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