angular.module('issueTrackingSystem.authentication', [])
    .factory('authentication', [
        '$http',
        '$q',
        '$location',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($http, $q, $location, $httpParamSerializerJQLike, BASE_URL) {
            function registerUser(user) {
                var deferred = $q.defer();

                $http.post(BASE_URL + 'api/Account/Register', user)
                    .then(function() {
                        deferred.resolve();
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function loginUser(user) {
                var deferred = $q.defer();

                user.grant_type = 'password';
                $http.post(
                    BASE_URL + 'api/Token', $httpParamSerializerJQLike(user))
                    .then(function(response){
                        console.log(response);
                        localStorage['currentUserToken'] = JSON.stringify(response);
                        $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.access_token;
                        deferred.resolve();
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function getCurrentUser() {
                var deferred = $q.defer();

                if(sessionStorage['currentUser']) {
                    return $q.when(JSON.parse(sessionStorage['currentUser']));
                }

                else if (localStorage['currentUserToken']) {
                    $http.get(BASE_URL + 'users/me')
                        .then(function(user) {
                            console.log(user);
                            sessionStorage['currentUser'] = JSON.stringify(user);
                            deferred.resolve(user);
                        }, function (error) {
                            console.log(error);
                        });

                    return deferred.promise;
                }
            }

            function isAuthenticated() {
                return localStorage['currentUserToken'] && sessionStorage['currentUser'];
            }

            function isAdmin() {
                return sessionStorage['currentUser'] && JSON.parse(sessionStorage['currentUser']).isAdmin;
            }

            function refreshHeaders() {
                if (localStorage['currentUserToken']){
                    $http.defaults.headers.common.Authorization = 'Bearer ' + JSON.parse(localStorage['currentUserToken']).access_token;
                }
            }

            function logout() {
                delete sessionStorage['currentUser'];
                delete localStorage['currentUserToken'];
                $http.defaults.headers.common.Authorization = undefined;
                $location.path('/');
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                isAuthenticated: isAuthenticated,
                isAdmin: isAdmin,
                getCurrentUser: getCurrentUser,
                refreshHeaders: refreshHeaders,
                logout: logout
            }
        }]);
