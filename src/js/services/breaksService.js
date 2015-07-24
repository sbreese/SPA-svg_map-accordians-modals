'use strict';

angular.module('MarriottBreaks').factory('breaksService', [
    '$http',
    '$q',
    function($http, $q){

        // List of properties that are searchable/filterable on the home page. Add items here to make them searchable
        var filterProperties = [
            'MARKET_CITY',
            'MARKET_STATE',
            'PROPERTY_CITY',
            'PROPERTY_STATE',
            'ZIP'
        ];

        function formatBreaksData(breaks){

            // if for some reason we didn't get data back, return an empty array
            if (!breaks.length || breaks.length <= 0){
                return [];
            }

            var currentBreak;

            for (var i = 0, l = breaks.length; i < l; i++){
                currentBreak = breaks[i];

                // reformat URLs to contain http protocol
                currentBreak.PROPERTY_PAGE_URL = formatUrl(currentBreak.PROPERTY_PAGE_URL);
                currentBreak.AVAILABILITY_URL = formatUrl(currentBreak.AVAILABILITY_URL);

                // build addresses
                formatAddresses(currentBreak);

                // build a property on the object that has all searchable fields. This should speed up the filtering process
                formatSearchField(currentBreak);

                // format the per night description. I would rather do it here once than have angular do it for each item
                formatPerNight(currentBreak);
            }

        }

        function formatUrl(url){
            if (url && url.length && url.length >= 4) {
                if (url.slice(0, 4) !== 'http') {
                    return 'http://' + url;
                }
            }

            return url;
        }

        function formatAddresses(currentBreak){
            currentBreak.PROPERTY_CITY_STATE = formatCityState(currentBreak);
            currentBreak.FULL_ADDRESS = formatFullAddress(currentBreak);

            // set the ZIP to a string. May need it as a number later?
            if (currentBreak.ZIP){
                currentBreak.ZIP = currentBreak.ZIP.toString();
            }
            else {
                currentBreak.ZIP = '';
            }
        }

        function formatCityState(currentBreak){
            var cityState = '';

            if (currentBreak.PROPERTY_CITY){
                cityState += currentBreak.PROPERTY_CITY + ', ';
            }

            if (currentBreak.PROPERTY_STATE){
                cityState += currentBreak.PROPERTY_STATE;
            }

            return cityState;
        }

        function formatFullAddress(currentBreak){
            var fullAddress = '';

            if (currentBreak.ADDRESS1){
                fullAddress = currentBreak.ADDRESS1 + ', ';
            }

            if (currentBreak.PROPERTY_CITY_STATE){
                fullAddress += currentBreak.PROPERTY_CITY_STATE;
            }
            else {
                if (currentBreak.PROPERTY_CITY){
                    fullAddress += currentBreak.PROPERTY_CITY + ', ';
                }

                if (currentBreak.PROPERTY_STATE){
                    fullAddress += currentBreak.PROPERTY_STATE;
                }
            }

            if (currentBreak.ZIP){
                fullAddress += ' ' + currentBreak.ZIP;
            }

            return fullAddress;
        }

        function formatSearchField(currentBreak){
            var searchField = '';
            var property;

            for (var i = 0, l = filterProperties.length; i < l; i++){
                property = filterProperties[i];

                if (currentBreak.hasOwnProperty(property)){
                    // set to uppercase to avoid case sensitivity
                    searchField += currentBreak[property].toUpperCase();
                }
            }

            currentBreak.SEARCH_FIELD = searchField;
        }

        // Format the "per night" string, i.e. 100-200 per night
        function formatPerNight(currentBreak){
            var perNight;

            // start with the min rate
            perNight = currentBreak.PROPERTY_MIN_RATE + currentBreak.PROPERTY_MIN_ASTERISK;

            // add the max rate (add a + sign if there is none)
            if (currentBreak.PROPERTY_MAX_RATE){
                perNight += '-' + currentBreak.PROPERTY_MAX_RATE + currentBreak.PROPERTY_MAX_ASTERISK;
            }
            else {
                perNight += '+';
            }

            perNight += ' per night';

            currentBreak.PER_NIGHT = perNight;
        }

        return {
            get: function(){
                var defered = $q.defer();

                $http.get('breaks').then(
                    // Success
                    function(response){
                        // Reformat some of the data to make it easier to work with
                        formatBreaksData(response.data);
                        defered.resolve(response.data);
                    },
                    // Fail
                    function(response){
                        defered.reject(response);
                    });

                return defered.promise;
            }
        };
    }
]);