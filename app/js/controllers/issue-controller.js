angular.module('issueTrackingSystem.issues', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/issues/:issueId', {
                name: 'displayIssue',
                templateUrl: 'app/templates/views/issue.html',
                controller: 'IssueCtrl'
            })
            .when('/issues/:issueId/edit', {
                name: 'editIssue',
                templateUrl: 'app/templates/views/issue-add-or-edit.html',
                controller: 'IssueCtrl'
            })
            .when('/projects/:projectId/add-issue', {
                name: 'addIssue',
                templateUrl: 'app/templates/views/issue-add-or-edit.html',
                controller: 'IssueCtrl'
            });
    }])
    .controller('IssueCtrl', [
        '$scope',
        '$rootScope',
        '$q',
        '$route',
        '$routeParams',
        '$location',
        'users',
        'issues',
        'projects',
        'labels',
        'comments',
        function($scope, $rootScope, $q, $route, $routeParams, $location, users, issues, projects, labels, comments) {
            var issueId = $routeParams.issueId;
            var projectId = $routeParams.projectId;
            var userId = $rootScope.currentUser.Id;
            var newIssue = $route.current.$$route.name == 'addIssue';
            var editIssue = $route.current.$$route.name == 'editIssue';
            var displayIssue = $route.current.$$route.name == 'displayIssue';
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

            var getComments = function(data) {
                if(newIssue || $location.path().indexOf('edit') !== -1) {
                    return $q.when([]);
                }
                else {
                    return comments.getCommentsForIssue(data.Id);
                }
            };

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

            var saveComment = function(comment) {
                comments.addComment(issueId, comment)
                    .then(function() {
                        $route.reload();
                    });
            };

            getIssue(issueId)
                .then(function(issue){
                    return $q.all([getProject(issue), getComments(issue)]);
                })
                .then(function(data) {
                    project = data[0];
                    issue.Comments = data[1];

                    var userIsLead = project.Lead.Id === userId;
                    $scope.canEdit = userIsLead;

                    if($scope.canChangeStatus) {
                        $scope.changeStatus = function(issueId, status) {
                            issues.changeIssueStatus(issueId, status.Id)
                                .then(function(statuses) {
                                    $scope.Status = status;
                                    $scope.issue.AvailableStatuses = statuses;
                                });

                        }
                    }

                    if(displayIssue){
                        var userIsAssignee = issue.Assignee.Id === userId;
                        if(userIsLead || userIsAssignee) {
                            $scope.canComment = true;
                            $scope.saveComment = saveComment;
                        }
                        else {
                            issues.getUserIssuesInProject(userId, project.Id)
                                .then(function(issue) {
                                    if(issue.length > 0){
                                        $scope.canComment = true;
                                        $scope.saveComment = saveComment;
                                    }
                                });
                        }
                    }

                    if(newIssue || editIssue) {
                        $scope.newIssue = newIssue;

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
                                    undefined :
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

                                $scope.save = function(issue) {
                                    if($scope.issueForm.$valid) {
                                        issue.assigneeId = issue.assignee.Id;
                                        issue.priorityId = issue.priority.Id;

                                        if($scope.newIssue) {
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
                                    }
                                    else {
                                        $scope.submitFailed = true;
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
                                };
                            });
                    }
                });
        }
    ]);