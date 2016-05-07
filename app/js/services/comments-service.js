angular.module('issueTrackingSystem.comments', [])
    .factory('comments', [
        '$rootScope',
        '$http',
        '$q',
        '$location',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($rootScope, $http, $q, $location, $httpParamSerializerJQLike, BASE_URL) {
            function getCommentsForIssue(issueId) {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'issues/' + issueId + '/comments')
                    .then(function(comments) {
                        deferred.resolve(comments.data);
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function addComment(issueId, comment) {
                var deferred = $q.defer();

                $http.post(BASE_URL + 'issues/' + issueId + '/comments', comment)
                    .then(function(comment) {
                        deferred.resolve(comment.data);
                    }, function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            return {
                getCommentsForIssue: getCommentsForIssue,
                addComment: addComment
            }
        }]);
