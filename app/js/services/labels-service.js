angular.module('issueTrackingSystem.labels', [])
    .factory('labels', [
        '$rootScope',
        '$http',
        '$q',
        '$location',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($rootScope, $http, $q, $location, $httpParamSerializerJQLike, BASE_URL) {
            function getLabels(query) {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'labels/?filter=' + query)
                    .then(function(labels) {
                        deferred.resolve(labels.data);
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            return {
                getLabels: getLabels
            }
        }]);
