'use strict';

angular.module('MarriottBreaks').filter('breaksSearchFilter', [
    function () {

        return function (breaks, input, limit) {
            var query = input.toUpperCase();

            // make sure we have valid breaks...
            if (!breaks || breaks.length === 0) {
                return [];
            }

            // if we got this far, we need to filter by query input
            var filteredBreaks = [];
            var currentBreak;

            for (var i = 0, l = breaks.length; i < l; i++) {
                currentBreak = breaks[i];

                if (breaks[i].SEARCH_FIELD.indexOf(query) !== -1) {
                    filteredBreaks.push(breaks[i]);
                }

                // if we reached the limit, exit the loop
                if (limit && filteredBreaks.length >= limit) {
                    break;
                }
            }

            if (filteredBreaks.length === 0) {
                var filteredBreaksMock = {};
                filteredBreaksMock.$$hashKey = "object:627";
                filteredBreaksMock.PROPERTY_CITY_STATE = "No hotels match this search";
                filteredBreaksMock.HOTEL_NAME = "";
                filteredBreaksMock.isPlaceholder = true;
                filteredBreaks.push(filteredBreaksMock);
            }

            return filteredBreaks;
        };

    }
]);