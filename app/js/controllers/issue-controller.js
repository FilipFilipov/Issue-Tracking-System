angular.module('issueTrackingSystem.issues', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/issues/:issueId', {
                templateUrl: 'app/templates/views/issue.html',
                controller: 'IssueCtrl'
            })
            .when('/issues/:issueId/edit', {
                templateUrl: 'app/templates/views/issue-add-or-edit.html',
                controller: 'IssueCtrl'
            })
            .when('/projects/:projectId/add-issue', {
                templateUrl: 'app/templates/views/issue-add-or-edit.html',
                controller: 'IssueCtrl'
            });
    }])
    .controller('IssueCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$routeParams',
        '$location',
        'users',
        'issues',
        'projects',
        'labels',
        function($scope, $rootScope, $q, $routeParams, $location, users, issues, projects, labels) {
            var issueId = $routeParams.issueId;
            var projectId = $routeParams.projectId;
            var userId = $rootScope.currentUser.Id;
            var newIssue = !!projectId;
            var issue, project;

            var getIssue = function(issueId) {
                if (issueId) {
                    return issues.getIssueById(issueId);
                }
                else {
                    return $q.when({});
                }
            };

            var getProject = function(data) {
                issue = newIssue ? {} : data;
                $scope.issue = issue;
                $scope.canChangeStatus = newIssue ? false : issue.Assignee.Id === userId;

                return projects.getProjectById(projectId || data.Project.Id)
            };

            getIssue(issueId)
                .then(function(issue){
                    return getProject(issue)
                })
                .then(function(data) {
                    project = data;
                    $scope.canEdit = project.Lead.Id === userId;

                    if($scope.canChangeStatus) {
                        $scope.changeStatus = function(issueId, status) {
                            issues.changeIssueStatus(issueId, status.Id)
                                .then(function(statuses) {
                                    $scope.Status = status;
                                    $scope.issue.AvailableStatuses = statuses;
                                });

                        }
                    }

                    if($scope.canEdit) {
                        $scope.newIssue = newIssue;

                        var getAllUsers = function() {
                            return users.getAllUsers();
                        };

                        var getUserProjects = function() {
                            if(newIssue) {
                                return projects.getUserProjects({filter: 'Lead.Id="' + userId + '"'});
                            }
                            else {
                                return $q.when([]);
                            }
                        };

                        $q.all([getAllUsers(), getUserProjects()])
                            .then(function(data) {
                                var users = data[0];
                                var userProjects = data[1];
                                var currentAssignee = users.filter(function(user) {
                                    return user.Id == (newIssue ? userId : issue.Assignee.Id)
                                })[0];
                                var currentProject = userProjects.filter(function(project) {
                                    return project.Id == projectId
                                })[0];
                                var currentPriority = newIssue ?
                                    {} :
                                    project.Priorities.filter(function(priority) {
                                        return priority.Id == issue.Priority.Id
                                    })[0];

                                $scope.users = users;
                                $scope.projects = userProjects;
                                $scope.priorities = project.Priorities;
                                $scope.model = {
                                    title: issue.Title,
                                    description: issue.Description,
                                    dueDate: issue.DueDate,
                                    project: currentProject,
                                    assignee: currentAssignee,
                                    priority: currentPriority,
                                    labels: issue.Labels
                                };

                                $scope.save = function(issue, newIssue) {
                                    issue.assigneeId = issue.assignee.Id;
                                    issue.priorityId = issue.priority.Id;

                                    if(newIssue) {
                                        issue.projectId = issue.project.Id;
                                        issues.addIssue(issue)
                                            .then(function() {
                                                $location.path('/projects/' + projectId);
                                            })
                                    }
                                    else {
                                        issues.editIssue(issueId, issue)
                                            .then(function() {
                                                $location.path('/issues/' + issueId);
                                            })
                                    }
                                };

                                $scope.updatePriorities = function() {
                                    projects.getProjectById($scope.model.project.Id)
                                        .then(function(project) {
                                            $scope.priorities = project.Priorities;
                                        })
                                };

                                $scope.loadLabels = function(query) {
                                    return labels.getLabels(query);
                                }
                            });
                    }
                });
        }
    ]);