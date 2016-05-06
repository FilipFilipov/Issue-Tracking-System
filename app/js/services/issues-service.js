angular.module('issueTrackingSystem.issues')
    .factory('issues', [
        '$http',
        '$q',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($http, $q, $httpParamSerializerJQLike, BASE_URL) {
            function getIssueById(id) {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'issues/' + id)
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

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

            function getProjectIssues(id) {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'projects/' + id + '/Issues')
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function editIssue(issueId, issue) {
                var deferred = $q.defer();

                $http.put(BASE_URL + 'issues/' + issueId, issue)
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function changeIssueStatus(issueId, statusId) {
                var deferred = $q.defer();

                $http.put(BASE_URL + 'issues/' + issueId + '/changestatus?statusId=' + statusId)
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            return {
                getIssueById: getIssueById,
                getUserIssues: getUserIssues,
                getProjectIssues: getProjectIssues,
                editIssue: editIssue,
                changeIssueStatus: changeIssueStatus
            }
        }]);
