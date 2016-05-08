angular.module('issueTrackingSystem.authentication', [])
    .factory('authentication', [
        '$rootScope',
        '$http',
        '$q',
        '$location',
        '$httpParamSerializerJQLike',
        'toastr',
        'BASE_URL',
        function($rootScope, $http, $q, $location, $httpParamSerializerJQLike, toastr, BASE_URL) {
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
                        toastr.error(error.data.error_description);
                    });

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
                setAuthHeaders: setAuthHeaders,
                changePassword: changePassword,
                logout: logout
            }
        }]);
