'use strict';

// Declare app level module which depends on views, and components
angular.module('issueTrackingSystem', [
    'ngRoute',
    'issueTrackingSystem.home',
    'issueTrackingSystem.authentication'
])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
