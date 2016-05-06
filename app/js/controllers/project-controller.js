angular.module('issueTrackingSystem.projects', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/projects/:id', {
            templateUrl: 'app/templates/views/project.html',
            controller: 'ProjectCtrl'
        });
    }])
    .controller('ProjectCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$routeParams',
        'issues',
        'projects',
        function($scope, $rootScope, $q, $routeParams, issues, projects) {
            var projectId = $routeParams.id;
            $q.all([
                projects.getProjectById(projectId),
                issues.getProjectIssues(projectId)
            ]).then(function (data) {
                var project = data[0];
                var issues = data[1];

                $scope.project = project;
                $scope.issues = issues;
                $scope.canEdit = project.Lead.Id === $rootScope.currentUser.Id
            });
        }
    ]);