'use strict';

angular.module('MarriottBreaks').factory('googleMapsService', [
    '$q',
    function($q){

        function getBreaksAddresses(breaks){
            var addresses = [];

            for (var i = 0, l = breaks.length; i < l; i++){
                addresses.push(breaks[i].FULL_ADDRESS);
            }

            return addresses;
        }

        return {

            getBreaksDistancesFromZipCode: function(zip, breaks){
                var deferred = $q.defer();

                // gather all the break destinations as an array
                var destinations = getBreaksAddresses(breaks);

                // get the distance data from the google maps API
                var distanceService = new google.maps.DistanceMatrixService();
                distanceService.getDistanceMatrix(
                    {
                        origins: [zip],
                        destinations: destinations,
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        durationInTraffic: false,
                        avoidHighways: false,
                        avoidTolls: false
                    }, distanceServiceCallback);

                function distanceServiceCallback(response, status){
                    if (status === google.maps.DistanceMatrixStatus.OK) {
                        deferred.resolve(response);
                    }
                    else {
                        deferred.reject(response);
                    }
                }

                return deferred.promise;
            }

        };

    }
]);