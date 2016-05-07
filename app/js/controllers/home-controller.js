angular.module('issueTrackingSystem.home', [
    'issueTrackingSystem.authentication'
])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/templates/views/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .controller('HomeCtrl', [
        '$scope',
        '$rootScope',
        '$route',
        '$q',
        'toastr',
        'authentication',
        'users',
        'issues',
        'projects',
        function($scope, $rootScope, $route, $q, toastr, authentication, users, issues, projects) {
            $scope.isAuthenticated = $rootScope.isAuthenticated;
            $scope.isAdmin = $rootScope.currentUser && $rootScope.currentUser.isAdmin;

            if ($scope.isAuthenticated) {
                $scope.issueParams = {
                    pageSize: 5,
                    pageNumber: 1
                };

                $q.all([
                    issues.getUserIssues({ orderBy: "DueDate desc" }),
                    projects.getUserProjects({filter: 'Lead.Id="' + $rootScope.currentUser.Id + '"'})
                ]).then(function (data) {
                    var userIssues = data[0];
                    var userProjects = data[1];
                    var userIssueProjects = userIssues.Issues.map(function(issue){
                        return issue.Project;
                    });

                    $scope.userIssues = userIssues;
                    $scope.userProjects = userProjects.concat(userIssueProjects);

                    $scope.reloadIssues = function() {
                        $scope.issueParams.orderBy = "DueDate desc";

                        issues.getUserIssues($scope.issueParams)
                            .then(function (paginatedIssues) {
                                $scope.userIssues = paginatedIssues;
                            });
                    }
                });
            }
            else {
                $scope.login = function (user) {
                    if($scope.loginUserForm.$valid) {
                        authentication.loginUser(user)
                            .then(function(){
                                return users.getCurrentUser();
                            })
                            .then(function() {
                                $route.reload();
                                toastr.success('Welcome ' + $rootScope.currentUser.Username)
                            });
                    }
                    else {
                        $scope.loginFailed = true;
                    }
                };

                $scope.register = function (user) {
                    if($scope.registerUserForm.$valid) {
                        if(user.password !== user.confirmPassword) {
                            toastr.error('Passwords do not match!');
                        }
                        else {
                            authentication.registerUser(user)
                                .then(function () {
                                    return authentication.loginUser(user);
                                })
                                .then(function () {
                                    return users.getCurrentUser();
                                })
                                .then(function() {
                                    $route.reload();
                                    toastr.success('User ' + $rootScope.currentUser.Username + 'has been registered.');
                                });
                        }
                    }
                    else {
                        $scope.registerFailed = true;
                    }

                };
            }
        }
    ]);