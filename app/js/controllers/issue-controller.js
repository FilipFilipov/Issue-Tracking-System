angular.module('issueTrackingSystem.issues', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/issues/:id', {
                templateUrl: 'app/templates/views/issue.html',
                controller: 'IssueCtrl'
            })
            .when('/issues/:id/edit', {
                templateUrl: 'app/templates/views/issue-edit.html',
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
            var issueId = $routeParams.id;
            var userId = $rootScope.currentUser.Id;
            var issue, project;

            issues.getIssueById(issueId)
                .then(function (data) {
                    issue = data;
                    $scope.issue = issue;
                    $scope.canChangeStatus = issue.Assignee.Id === userId;

                    return projects.getProjectById(issue.Project.Id)
                }).then(function(data) {
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
                        users.getAllUsers()
                            .then(function(users) {
                                var currentAssignee = users.filter(function(user) {
                                    return user.Id == issue.Assignee.Id
                                })[0];
                                var currentPriority = project.Priorities.filter(function(priority) {
                                    return priority.Id == issue.Priority.Id
                                })[0];

                                $scope.users = users;
                                $scope.priorities = project.Priorities;
                                $scope.model = {
                                    title: issue.Title,
                                    description: issue.Description,
                                    dueDate: issue.DueDate,
                                    assignee: currentAssignee,
                                    priority: currentPriority,
                                    labels: issue.Labels
                                };

                                $scope.save = function(issue) {
                                    issue.assigneeId = issue.assignee.Id;
                                    issue.priorityId = issue.priority.Id;
                                    issues.editIssue(issueId, issue)
                                        .then(function() {
                                            $location.path('/issues/' + issueId);
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