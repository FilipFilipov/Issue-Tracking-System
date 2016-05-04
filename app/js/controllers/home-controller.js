angular.module('issueTrackingSystem.home', [
    'issueTrackingSystem.authentication'
])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/templates/views/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .controller('HomeCtrl', [
        '$scope',
        'authentication',
        function($scope, authentication) {
            $scope.login = function (user) {
                authentication.loginUser(user)
                    .then(function(){
                        return authentication.getCurrentUser();
                    });
            };

            $scope.register = function (user) {
                if(user.password !== user.confirmPassword) {
                    console.warn('Passwords do not match!');
                }
                else {
                    authentication.registerUser(user)
                        .then(function () {
                            return authentication.loginUser(user);
                        })
                        .then(function () {
                            return authentication.getCurrentUser();
                        });
                }
            };
        }]);