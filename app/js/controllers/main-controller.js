angular.module('issueTrackingSystem.common', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/profile/password', {
                templateUrl: 'app/templates/views/change-password.html',
                controller: 'MainCtrl'
            });
    }])
    .controller('MainCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$route',
        'authentication',
        'toastr',
        function($rootScope, $scope, $location, $route, authentication, toastr) {
            $scope.logout = function() {
                authentication.logout();
                toastr.info('Goodbye!');

                if($location.path() === '/') {
                    $route.reload();
                }
            };

            $scope.changePassword = function(password){
                if($scope.changePasswordForm.$valid) {
                    if(password.newPassword !== password.confirmPassword) {
                        toastr.error('Passwords do not match!');
                    }
                    else{
                        authentication.changePassword(password);
                        toastr.success('Password has been changed');
                        $location.path('/');
                    }
                }
                else {
                    $scope.submitFailed = true;
                }
            }
        }
    ]);