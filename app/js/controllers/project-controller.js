angular.module('issueTrackingSystem.projects', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/projects/:id', {
                templateUrl: 'app/templates/views/project.html',
                controller: 'ProjectCtrl'
            })
            .when('/projects/:id/edit', {
                templateUrl: 'app/templates/views/project-edit.html',
                controller: 'ProjectCtrl'
            });
    }])
    .controller('ProjectCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$routeParams',
        '$location',
        'issues',
        'projects',
        'users',
        'labels',
        function($scope, $rootScope, $q, $routeParams, $location, issues, projects, users, labels) {
            var projectId = $routeParams.id;

            $q.all([
                projects.getProjectById(projectId),
                issues.getProjectIssues(projectId)
            ]).then(function (data) {
                var project = data[0];
                var issues = data[1];
                var leadId = project.Lead.Id;

                $scope.project = project;
                $scope.issues = issues;
                $scope.canEdit = $rootScope.currentUser.isAdmin || leadId === $rootScope.currentUser.Id;

                if($scope.canEdit) {
                    users.getAllUsers()
                        .then(function(users) {
                            var currentLead = users.filter(function(user) {
                                return user.Id == leadId
                            })[0];

                            $scope.users = users;
                            $scope.model = {
                                name: project.Name,
                                description: project.Description,
                                lead: currentLead,
                                labels: project.Labels,
                                priorities: project.Priorities
                            };

                            $scope.save = function(project) {
                                console.log($scope);
                                if($scope.projectForm.$valid) {
                                    project.leadId = project.lead.Id;
                                    projects.editProject(projectId, project)
                                        .then(function() {
                                            $location.path('/projects/' + projectId);
                                        })
                                }
                                else {
                                    $scope.submitFailed = true;
                                }

                            };

                            $scope.loadLabels = function(query) {
                                return labels.getLabels(query);
                            }
                        });
                }
            });
        }
    ]);