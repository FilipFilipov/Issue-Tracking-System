'use strict';

// Declare app level module which depends on views, and components
angular.module('issueTrackingSystem', [
    'ngRoute',
    'issueTrackingSystem.home',
    'issueTrackingSystem.authentication'
])
    .controller('MainCtrl', [
    '$rootScope',
    '$scope',
    'authentication',
    function($rootScope, $scope, authentication) {
        $scope.logout = authentication.logout;
        $scope.changePassword = function(password){
            if(password.newPassword !== password.confirmPassword) {
                console.warn('Passwords do not match!');
            }
            else{
                authentication.changePassword(password);
            }
        }
    }])
    .run(['$rootScope', '$location', 'authentication', function ($rootScope, $location, authentication) {
        $rootScope.$on('$locationChangeStart', function () {
            if (!$rootScope.isAuthenticated && $location.path() !== '/') {
                $location.path('/');
            }
        });

        authentication.setAuthHeaders();
        authentication.getCurrentUser();
    }])
    .config(['$routeProvider', function ($routeProvider){
        $routeProvider.when('/profile/password', {
            templateUrl: 'app/templates/views/change-password.html',
            controller: 'MainCtrl'
        })
            .otherwise({redirectTo: '/'});
    }])
    .constant('BASE_URL', 'http://softuni-issue-tracker.azurewebsites.net/');
