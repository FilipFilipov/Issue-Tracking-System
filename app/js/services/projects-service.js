angular.module('issueTrackingSystem.projects')
    .factory('projects', [
        '$http',
        '$q',
        '$httpParamSerializerJQLike',
        'BASE_URL',
        function($http, $q, $httpParamSerializerJQLike, BASE_URL) {
            function getAllProjects(projectsParams) {
                var deferred = $q.defer();
                projectsParams.filter = '';

                $http.get(BASE_URL + 'projects?' + $httpParamSerializerJQLike(projectsParams))
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function getProjectById(id) {
                var deferred = $q.defer();

                $http.get(BASE_URL + 'projects/' + id)
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }


            function getUserProjects(projectsParams) {
                var deferred = $q.defer();

                projectsParams.pageSize = projectsParams.pageSize || 1000;
                projectsParams.pageNumber = projectsParams.pageNumber || 1;
                $http.get(BASE_URL + 'projects/?' + $httpParamSerializerJQLike(projectsParams))
                    .then(function(response) {
                        deferred.resolve(response.data.Projects)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function editProject(projectId, project) {
                var deferred = $q.defer();

                $http.put(BASE_URL + 'projects/' + projectId, project)
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            function addProject(project) {
                var deferred = $q.defer();

                $http.post(BASE_URL + 'projects', project)
                    .then(function(response) {
                        deferred.resolve(response.data)
                    }, function(error) {
                        console.log(error);
                    });

                return deferred.promise;
            }

            return {
                getAllProjects: getAllProjects,
                getProjectById: getProjectById,
                getUserProjects: getUserProjects,
                editProject: editProject,
                addProject: addProject
            }
        }]);
