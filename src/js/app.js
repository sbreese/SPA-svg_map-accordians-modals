'use strict';

angular.module('MarriottBreaks', [
    'ngRoute',
    'mm.foundation'
]).

config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'html/views/home.html', controller: 'homeCtrl'});

    $routeProvider.otherwise({redirectTo: '/home'});
}]);