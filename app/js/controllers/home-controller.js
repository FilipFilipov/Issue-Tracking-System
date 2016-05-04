angular.module('issueTrackingSystem.home', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/templates/views/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .controller('HomeCtrl', [
        '$scope',
        function($scope) {
            $scope.login = function (user) {
                console.log(user);
            };

            $scope.register = function (user) {
                console.log(user);
            };
        }]);