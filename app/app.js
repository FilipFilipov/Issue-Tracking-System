'use strict';

// Declare app level module which depends on views, and components
angular.module('issueTrackingSystem', [
    'ngRoute',
    'ui.bootstrap.pagination',
    '720kb.datepicker',
    'ngTagsInput',
    'frapontillo.ex.filters',
    'issueTrackingSystem.home',
    'issueTrackingSystem.authentication',
    'issueTrackingSystem.users',
    'issueTrackingSystem.issues',
    'issueTrackingSystem.projects',
    'issueTrackingSystem.labels',
    'issueTrackingSystem.filters.unique'
])
    .controller('MainCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$route',
        'authentication',
        'users',
        function($rootScope, $scope, $location, $route, authentication, users) {
            $scope.logout = function() {
                authentication.logout();

                if($location.path() === '/') {
                    $route.reload();
                }
            };

            $scope.changePassword = function(password){
                if(password.newPassword !== password.confirmPassword) {
                    console.warn('Passwords do not match!');
                }
                else{
                    authentication.changePassword(password);
                }
            }
        }
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
        function ($routeProvider){
            $routeProvider
                .when('/profile/password', {
                    templateUrl: 'app/templates/views/change-password.html',
                    controller: 'MainCtrl'
                })
                .otherwise({redirectTo: '/'});
        }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
