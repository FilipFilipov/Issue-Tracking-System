angular.module('issueTrackingSystem.users', [])
    .factory('users', [
        '$rootScope',
        '$http',
        '$q',
        '$location',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($rootScope, $http, $q, $location, $httpParamSerializerJQLike, BASE_URL) {
            function getAllUsers() {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'users')
                    .then(function(users) {
                        deferred.resolve(users.data);
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function getCurrentUser() {
                var deferred = $q.defer();

                if(sessionStorage['currentUser']) {
                    var user = JSON.parse(sessionStorage['currentUser']);
                    $rootScope.currentUser = user;
                    $rootScope.isAuthenticated = true;

                    return $q.when(user);
                }

                else if (localStorage['currentUserToken']) {
                    $http.get(BASE_URL + 'users/me')
                        .then(function(user) {
                            sessionStorage['currentUser'] = JSON.stringify(user.data);
                            $rootScope.currentUser = user.data;
                            $rootScope.isAuthenticated = true;

                            deferred.resolve(user);
                        }, function (error) {
                            console.log(error);
                        });
                }
                return deferred.promise;
            }

            return {
                getAllUsers: getAllUsers,
                getCurrentUser: getCurrentUser
            }
        }]);
