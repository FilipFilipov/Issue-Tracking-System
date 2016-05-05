angular.module('issueTrackingSystem.authentication', [])
    .factory('authentication', [
        '$rootScope',
        '$http',
        '$q',
        '$location',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($rootScope, $http, $q, $location, $httpParamSerializerJQLike, BASE_URL) {
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
                        delete sessionStorage['currentUser'];
                        localStorage['currentUserToken'] = JSON.stringify(response.data);
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

            function setAuthHeaders(){
                if (localStorage['currentUserToken']) {
                    var tokenObj = JSON.parse(localStorage['currentUserToken']);
                    var expireDate = new Date(tokenObj['.expires']);

                    if (new Date() > expireDate) {
                        logout();
                    }
                    else {
                        $http.defaults.headers.common.Authorization = 'Bearer ' + tokenObj.access_token;
                    }
                }

            }

            function changePassword(password) {
                var deferred = $q.defer();

                $http.post(BASE_URL + 'api/Account/ChangePassword', password)
                    .then(function(){
                        deferred.resolve();
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function logout() {
                delete sessionStorage['currentUser'];
                delete localStorage['currentUserToken'];
                $http.defaults.headers.common.Authorization = undefined;

                $rootScope.currentUser = undefined;
                $rootScope.isAuthenticated = false;

                $location.path('/');
            }

            return {
                registerUser: registerUser,
                loginUser: loginUser,
                getCurrentUser: getCurrentUser,
                setAuthHeaders: setAuthHeaders,
                changePassword: changePassword,
                logout: logout
            }
        }]);
