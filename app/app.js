'use strict';

// Declare app level module which depends on views, and components
angular.module('issueTrackingSystem', [
    'ngRoute',
    'ngAnimate',
    'angular-loading-bar',
    'ui.bootstrap.pagination',
    '720kb.datepicker',
    'ngTagsInput',
    'toastr',
    'frapontillo.ex.filters',
    'issueTrackingSystem.common',
    'issueTrackingSystem.home',
    'issueTrackingSystem.authentication',
    'issueTrackingSystem.users',
    'issueTrackingSystem.issues',
    'issueTrackingSystem.projects',
    'issueTrackingSystem.labels',
    'issueTrackingSystem.comments',
    'issueTrackingSystem.filters.unique'
])
    .run([
        '$rootScope',
        '$location',
        'authentication',
        'users',
        function ($rootScope, $location, authentication, users) {
            $rootScope.$on('$locationChangeStart', function () {
                if (!$rootScope.isAuthenticated && $location.path() !== '/') {
                    $location.path('/');
                }
            });

            authentication.setAuthHeaders();
            users.getCurrentUser();
        }
    ])
    .config([
        '$routeProvider',
        'toastrConfig',
        function ($routeProvider, toastrConfig){
            $routeProvider.otherwise({redirectTo: '/'});

            angular.extend(toastrConfig, {
                positionClass: 'toast-top-center'
            });
        }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
