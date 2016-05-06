angular.module('issueTrackingSystem.issues', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/issues/:id', {
            templateUrl: 'app/templates/views/issue.html',
            controller: 'IssueCtrl'
        });
    }])
    .controller('IssueCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$routeParams',
        'issues',
        'projects',
        function($scope, $rootScope, $q, $routeParams, issues, projects) {
            var issueId = $routeParams.id;
            var userId = $rootScope.currentUser.Id;

            $q.all([
                issues.getIssueById(issueId)
            ]).then(function (data) {
                var issue = data[0];
                var labels = issue.Labels.map(function(label){
                    return label.Name;
                });

                issue.Labels = labels.join(', ');
                $scope.issue = issue;
                $scope.canChangeStatus = issue.Assignee.Id === userId;

                return projects.getProjectById(issue.Project.Id)
            }).then(function(project) {
                $scope.canEdit = project.Lead.Id === userId
            });

            $scope.changeStatus = function(issueId, status) {
                issues.changeIssueStatus(issueId, status.Id)
                    .then(function(statuses) {
                        $scope.Status = status;
                        $scope.issue.AvailableStatuses = statuses;
                    });

            }
        }
    ]);