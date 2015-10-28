'use strict';

// small little wrapper to get/set cookie values. Hopefully improves readability and developer doesn't have to remember cookie keys
angular.module('MarriottBreaks').factory('cookieService', [
    '$cookies',
    function($cookies){

        var COOKIE_KEYS = {
            LAST_VISITED: 'lastVisited'
        };

        var defaultOptions = {
            path: '/'
        };

        return {

            // LAST VISITED HOTEL -----------
            saveLastVisitedHotel: function(id, hotel, isTopDestination){
                // if this is a top destination, save the market city as top destination. otherwise, save false
                var topDestination = isTopDestination ? hotel.MARKET_CITY : false;

                var cookieData = {
                    id: id,
                    marketCity: hotel.MARKET_CITY,
                    state: hotel.PROPERTY_STATE,
                    region: hotel.REGION,
                    topDestination: topDestination
                };

                $cookies.putObject(COOKIE_KEYS.LAST_VISITED, cookieData, defaultOptions);
            },

            getLastVisitedHotel: function(){
                return $cookies.getObject(COOKIE_KEYS.LAST_VISITED);
            },

            removeLastVisitedHotel: function(){
                $cookies.remove(COOKIE_KEYS.LAST_VISITED, defaultOptions);
            }

        };

    }
]);