'use strict';

// Declare app level module which depends on views, and components
angular.module('issueTrackingSystem', [
    'ngRoute',
    'ui.bootstrap.pagination',
    'issueTrackingSystem.home',
    'issueTrackingSystem.authentication',
    'issueTrackingSystem.issues',
    'issueTrackingSystem.projects',
    'issueTrackingSystem.filters.unique'
])
    .controller('MainCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$route',
        'authentication',
        function($rootScope, $scope, $location, $route, authentication) {
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
        function ($rootScope, $location, authentication) {
            $rootScope.$on('$locationChangeStart', function () {
                if (!$rootScope.isAuthenticated && $location.path() !== '/') {
                    $location.path('/');
                }
            });

            authentication.setAuthHeaders();
            authentication.getCurrentUser();
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
