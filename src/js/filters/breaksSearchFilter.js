'use strict';

angular.module('MarriottBreaks').filter('breaksSearchFilter', [
    '$q',
    '$filter',
    function ($q, $filter) {

        return function (breaksPromise, input, limit, maxDistance) {
            var deferred = $q.defer();
            var query = input.toUpperCase();

            // we are using promises for the results, because they may be coming from google maps.
            // $q.when() will listen on the promise and then we can filter with it after it resolves
            $q.when(breaksPromise).then(function (breaks) {
                // make sure we have valid breaks...
                if (!breaks || breaks.length === 0) {
                    deferred.resolve([]);
                    return;
                }

                // if we got this far, we need to filter by query input
                var filteredBreaks = [];
                var currentBreak;

                // if any breaks have a distance value, they are from the google maps query
                var useDistance = (angular.isUndefined(breaks[0].DISTANCE) || breaks[0].DISTANCE === null) ? false : true;

                for (var i = 0, l = breaks.length; i < l; i++) {
                    currentBreak = breaks[i];

                    // if we are filtering by distance, make sure it is in range. If so, add it - we don't care
                    // about the query value because it might not match
                    if (useDistance){
                        if (!maxDistance || currentBreak.DISTANCE_VALUE < maxDistance){
                            filteredBreaks.push(currentBreak);
                        }
                    }
                    else {
                        if (breaks[i].SEARCH_FIELD.indexOf(query) !== -1) {
                            filteredBreaks.push(breaks[i]);
                        }
                    }

                    // if we reached the limit, exit the loop
                    if (limit && filteredBreaks.length >= limit){
                        break;
                    }
                }

                // if we are filtering by distance, sort by distance
                if (useDistance){
                    var orderFilter = $filter('orderBy');
                    filteredBreaks = orderFilter(filteredBreaks, '+DISTANCE_VALUE', false);
                }

                deferred.resolve(filteredBreaks);
            });

            return deferred.promise;
        };

    }
]);