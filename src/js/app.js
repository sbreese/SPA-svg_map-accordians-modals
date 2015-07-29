'use strict';

angular.module('MarriottBreaks', [
    'ngRoute',
    'angular.filter',
    'duScroll',
    'mm.foundation'
]).

config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'html/views/home.html', controller: 'homeCtrl'});

    $routeProvider.otherwise({redirectTo: '/home'});
}]).

 // Setup scroll easing for duScroll directive
value('duScrollEasing', function (t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; }).
value('duScrollDuration', 700);