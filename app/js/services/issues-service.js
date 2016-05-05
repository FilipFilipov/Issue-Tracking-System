angular.module('issueTrackingSystem.issues', [])
    .factory('issues', [
        '$http',
        '$q',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($http, $q, $httpParamSerializerJQLike, BASE_URL) {
            function getUserIssues(issuesParams) {
                var deferred = $q.defer();

                issuesParams.pageSize = issuesParams.pageSize || 1000;
                issuesParams.pageNumber = issuesParams.pageNumber || 1;
                $http.get(BASE_URL + 'issues/me?' + $httpParamSerializerJQLike(issuesParams))
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            return {
                getUserIssues: getUserIssues
            }
        }]);
