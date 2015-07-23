'use strict';

angular.module('MarriottBreaks', [
    'ngRoute'
]).

config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {templateUrl: 'views/home.html', controller: 'homeCtrl'});

    $routeProvider.otherwise({redirectTo: '/home'});
}]);