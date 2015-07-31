'use strict';

angular.module('MarriottBreaks').factory('mediaService', [
    function(){

        var isMobile = null;

        return {

            isMobile: function(){
                if (isMobile === null){
                    isMobile = Modernizr.mq('only screen and (max-width: 1024px)');
                }
                return isMobile;
            }

        };

    }
]);