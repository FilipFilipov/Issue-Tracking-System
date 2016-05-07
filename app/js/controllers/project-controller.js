angular.module('issueTrackingSystem.projects', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/projects', {
                name: 'indexProjects',
                templateUrl: 'app/templates/views/all-projects.html',
                controller: 'ProjectCtrl'
            })
            .when('/projects/add', {
                name: 'addProject',
                templateUrl: 'app/templates/views/project-add-or-edit.html',
                controller: 'ProjectCtrl'
            })
            .when('/projects/:id', {
                name: 'displayProject',
                templateUrl: 'app/templates/views/project.html',
                controller: 'ProjectCtrl'
            })
            .when('/projects/:id/edit', {
                name: 'editProject',
                templateUrl: 'app/templates/views/project-add-or-edit.html',
                controller: 'ProjectCtrl'
            });
    }])
    .controller('ProjectCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$route',
        '$routeParams',
        '$location',
        'issues',
        'projects',
        'users',
        'labels',
        function($scope, $rootScope, $q, $route, $routeParams, $location, issues, projects, users, labels) {
            var projectId = $routeParams.id;
            var indexProjects = $route.current.$$route.name == 'indexProjects';
            var addProject = $route.current.$$route.name == 'addProject';
            var isAdmin = $rootScope.currentUser.isAdmin;

            var saveFunc = function(project) {
                if ($scope.projectForm.$valid) {
                    project.leadId = project.lead.Id;

                    if ($scope.newProject) {
                        projects.addProject(project)
                            .then(function (newProject) {
                                $location.path('/projects/' + newProject.Id);
                            })
                    }
                    else {
                        projects.editProject(projectId, project)
                            .then(function () {
                                $location.path('/projects/' + projectId);
                            })
                    }

                }
                else {
                    $scope.submitFailed = true;
                }
            };

            var loadLabelsFunc = function(query) {
                return labels.getLabels(query);
            };

            if (indexProjects) {
                if(isAdmin) {
                    var projectsParams = {
                        pageNumber: 1,
                        pageSize: 20
                    };

                    projects.getAllProjects(projectsParams)
                        .then(function(paginatedProjects) {
                            $scope.projects = paginatedProjects;
                            $scope.projectsParams = projectsParams;

                            $scope.reloadProjects = function() {
                                projects.getAllProjects($scope.projectsParams)
                                    .then(function(paginatedProjects) {
                                        $scope.projects = paginatedProjects;
                                    })
                            }
                        });
                }
                else {
                    $location.path('/');
                }
            }
            else if (addProject) {
                if(isAdmin) {
                    $scope.newProject = true;

                    users.getAllUsers()
                        .then(function (users) {
                            var currentLead = users.filter(function(user) {
                                return user.Id == $rootScope.currentUser.Id;
                            })[0];

                            $scope.model = { lead: currentLead };
                            $scope.users = users;
                            $scope.save = saveFunc;
                            $scope.loadLabels = loadLabelsFunc;
                        });
                }
                else {
                    $location.path('/');
                }
            }
            else {
                $q.all([
                    projects.getProjectById(projectId),
                    issues.getProjectIssues(projectId)
                ]).then(function (data) {
                    var project = data[0];
                    var issues = data[1];
                    var leadId = project.Lead.Id;

                    $scope.project = project;
                    $scope.issues = issues;
                    $scope.canEdit = isAdmin || leadId === $rootScope.currentUser.Id;

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
                                $scope.save = saveFunc;
                                $scope.loadLabels = loadLabelsFunc;
                            });
                    }
                });
            }
        }
    ]);