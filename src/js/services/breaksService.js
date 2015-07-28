'use strict';

angular.module('MarriottBreaks').factory('breaksService', [
    '$http',
    '$q',
    function ($http, $q) {

        function formatBreaksData(breaks) {

            // Region data will be built from the breaks data. It will contain states and totals for each region
            // Format:
            //{
            //    MIDWEST: {
            //        count: 12,
            //        states:
            //        {
            //            IL: 7,
            //            MI: 5
            //        }
            //    }
            //}
            var regions = {};

            // if for some reason we didn't get data back, return an empty array
            if (!breaks.length || breaks.length <= 0) {
                breaks = [];
            }
            else {
                var currentBreak;

                for (var i = 0, l = breaks.length; i < l; i++) {
                    currentBreak = breaks[i];

                    // reformat URLs to contain http protocol
                    currentBreak.PROPERTY_PAGE_URL = formatUrl(currentBreak.PROPERTY_PAGE_URL);
                    currentBreak.AVAILABILITY_URL = formatUrl(currentBreak.AVAILABILITY_URL);

                    // make top destination a boolean value - much easier to work with and better for performance
                    currentBreak.TOP_DESTINATION = (currentBreak.TOP_DESTINATIONS === 'Y');

                    // build addresses
                    formatAddresses(currentBreak);

                    // build a property on the object that has all searchable fields. This should speed up the filtering process
                    formatSearchField(currentBreak);

                    // format the per night description. I would rather do it here once than have angular do it for each item
                    formatPerNight(currentBreak);

                    // add this item to the regions data
                    addBreakToRegionData(currentBreak, regions);
                }
            }

            updateRegionTotals(regions);

            return {breaks: breaks, regions: regions};
        }

        function formatUrl(url) {
            if (url && url.length && url.length >= 4) {
                if (url.slice(0, 4) !== 'http') {
                    return 'http://' + url;
                }
            }

            return url;
        }

        function formatAddresses(currentBreak) {
            currentBreak.PROPERTY_CITY_STATE = formatCityState(currentBreak);
            currentBreak.FULL_ADDRESS = formatFullAddress(currentBreak);

            // set the ZIP to a string. May need it as a number later?
            if (currentBreak.ZIP) {
                currentBreak.ZIP = currentBreak.ZIP.toString();
            }
            else {
                currentBreak.ZIP = '';
            }
        }

        function formatCityState(currentBreak) {
            var cityState = '';

            if (currentBreak.PROPERTY_CITY) {
                cityState += currentBreak.PROPERTY_CITY + ', ';
            }

            if (currentBreak.PROPERTY_STATE) {
                cityState += currentBreak.PROPERTY_STATE;
            }

            return cityState;
        }

        function formatFullAddress(currentBreak) {
            var fullAddress = '';

            if (currentBreak.ADDRESS1) {
                fullAddress = currentBreak.ADDRESS1 + ', ';
            }

            if (currentBreak.PROPERTY_CITY_STATE) {
                fullAddress += currentBreak.PROPERTY_CITY_STATE;
            }
            else {
                if (currentBreak.PROPERTY_CITY) {
                    fullAddress += currentBreak.PROPERTY_CITY + ', ';
                }

                if (currentBreak.PROPERTY_STATE) {
                    fullAddress += currentBreak.PROPERTY_STATE;
                }
            }

            if (currentBreak.ZIP) {
                fullAddress += ' ' + currentBreak.ZIP;
            }

            return fullAddress;
        }

        // List of properties that are searchable/filterable on the home page. Add items here to make them searchable
        var filterProperties = [
            'MARKET_CITY',
            'MARKET_STATE',
            'PROPERTY_CITY',
            'PROPERTY_STATE',
            'ZIP',
            'REGION'
        ];

        function formatSearchField(currentBreak) {
            var searchField = '';
            var property;

            for (var i = 0, l = filterProperties.length; i < l; i++) {
                property = filterProperties[i];

                if (currentBreak.hasOwnProperty(property)) {
                    // set to uppercase to avoid case sensitivity
                    searchField += currentBreak[property].toUpperCase();
                }
            }

            currentBreak.SEARCH_FIELD = searchField;
        }

        // Format the "per night" string, i.e. 100-200 per night
        function formatPerNight(currentBreak) {
            var priceRange;

            // start with the currency symbol
            priceRange = currentBreak.CURRENCY_SYMBOL;

            // add the min rate
            priceRange += currentBreak.PROPERTY_MIN_RATE + currentBreak.PROPERTY_MIN_ASTERISK;

            // add the max rate (add a + sign if there is none)
            if (currentBreak.PROPERTY_MAX_RATE) {
                priceRange += '-' + currentBreak.PROPERTY_MAX_RATE + currentBreak.PROPERTY_MAX_ASTERISK;
            }
            else {
                priceRange += '+';
            }

            currentBreak.PRICE_RANGE = priceRange;
        }

        function addBreakToRegionData(currentBreak, regions) {
            var regionName = currentBreak.REGION;
            var state = currentBreak.PROPERTY_STATE;
            var region;

            // check to see if this region already exists
            // if yes, add it to the existing region. Otherwise, create the region
            if (regions.hasOwnProperty(regionName)) {
                region = regions[regionName];

                // now check to see if this region already has the current break's state
                // if it does, add 1 to the value. Otherwise create it at 1
                if (region.states.hasOwnProperty(state)) {
                    region.states[state] += 1;
                }
                else {
                    region.states[state] = 1;
                }
            }
            else {
                // Create the region and its first state, setting the state count to 1
                region = regions[regionName] = {states: {}};
                region.states[state] = 1;
            }
        }

        function updateRegionTotals(regions) {
            var region;

            for (var regionName in regions) {
                if (regions.hasOwnProperty(regionName)) {
                    region = regions[regionName];

                    region.count = 0;

                    for (var stateName in region.states){
                        if (region.states.hasOwnProperty(stateName)){
                            region.count += region.states[stateName];
                        }
                    }
                }
            }
        }

        return {
            get: function () {
                var defered = $q.defer();

                $http.get('breaks').then(
                    // Success
                    function (response) {
                        // Reformat some of the data to make it easier to work with
                        var formattedData = formatBreaksData(response.data);
                        defered.resolve(formattedData);
                    },
                    // Fail
                    function (response) {
                        defered.reject(response);
                    });

                return defered.promise;
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
            }
        };
    }
]);