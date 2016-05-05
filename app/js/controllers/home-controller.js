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
        'authentication',
        'issues',
        'projects',
        function($scope, $rootScope, $route, $q, authentication, issues, projects) {
            $scope.isAuthenticated = $rootScope.isAuthenticated;

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
                    authentication.loginUser(user)
                        .then(function(){
                            return authentication.getCurrentUser();
                        })
                        .then(function() {
                            $route.reload();
                        });
                };

                $scope.register = function (user) {
                    if(user.password !== user.confirmPassword) {
                        console.warn('Passwords do not match!');
                    }
                    else {
                        authentication.registerUser(user)
                            .then(function () {
                                return authentication.loginUser(user);
                            })
                            .then(function () {
                                return authentication.getCurrentUser();
                            })
                            .then(function() {
                                $route.reload();
                            });
                    }
                };
            }
        }
    ]);