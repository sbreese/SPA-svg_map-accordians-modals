'use strict';

// Formats the breaks data for maximum UI performance
angular.module('MarriottBreaks').factory('breaksFormatterService', [
    function () {

        // format breaks data to build groups for grouping and filtering
        function formatBreaksData(breaksData){
            var groups = buildGroups(breaksData.breaks);

            breaksData.regionGroups = groups.regionGroups;
            breaksData.topDestinationGroups = groups.topDestinationGroups;
        }

        function buildGroups(breaks){
            // initialize the groups
            var regionGroups = [];
            var topDestinationGroups = [];

            var hotel;

            // loop through each hotel and add it to region and top destination groups
            for (var i = 0, l = breaks.length; i < l; i++){
                hotel = breaks[i];

                // add to region group
                addHotelToRegionGroup(breaks[i], regionGroups);

                // if this is a top destination, add it to the appropriate top destination group
                if (hotel.TOP_DESTINATION === 'TRUE' || hotel.TOP_DESTINATION === 'true'){
                    addHotelToTopDestinationGroup(hotel, topDestinationGroups);
                }
            }

            return {regionGroups: regionGroups, topDestinationGroups: topDestinationGroups};
        }

        function addHotelToRegionGroup(hotel, regionGroups){
            // first get the region group
            var regionGroup = getRegionGroup(hotel.REGION, regionGroups);

            // now get the state group
            var stateGroup = getStateGroup(hotel.PROPERTY_STATE, regionGroup);

            stateGroup.breaks.push(hotel);
        }

        function getRegionGroup(region, regionGroups){
            var regionGroup;

            for (var i = 0, l = regionGroups.length; i < l; i++){
                regionGroup = regionGroups[i];

                // if we found a match, return the group
                if (regionGroup.region === region){
                    return regionGroup;
                }
            }

            // if we didn't find a matching group, add a new group
            regionGroup = {region: region, stateGroups: []};
            regionGroups.push(regionGroup);

            return regionGroup;
        }

        function getStateGroup(state, regionGroup){
            var stateGroup;

            for (var i = 0, l = regionGroup.stateGroups.length; i < l; i++){
                stateGroup = regionGroup.stateGroups[i];

                // if we found a match, return the group
                if (stateGroup.state === state){
                    return stateGroup;
                }
            }

            // if we didn't find a matching group, add a new group
            stateGroup = {state: state, breaks: []};
            regionGroup.stateGroups.push(stateGroup);

            return stateGroup;
        }

        function addHotelToTopDestinationGroup(hotel, topDestinationGroups){
            var destination = hotel.MARKET_CITY;

            // get the top destination group
            var topDestinationGroup = getTopDestinationGroup(destination, topDestinationGroups);

            // add this hotel to the group
            topDestinationGroup.breaks.push(hotel);
        }

        function getTopDestinationGroup(destination, topDestinationGroups){
            var topDestinationGroup;

            for (var i = 0, l = topDestinationGroups.length; i < l; i++){
                topDestinationGroup = topDestinationGroups[i];

                // if we found a match, return the group
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
            formatBreaksData: formatBreaksData
        };
    }
]);