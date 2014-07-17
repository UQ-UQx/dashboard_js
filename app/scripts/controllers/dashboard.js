'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('DashboardCtrl', ['$scope','$http','RequestService', 'AuthService', 'Course', function ($scope, $http, RequestService, AuthService, Course) {
        //$scope.currentCourse = 'bioimg_101x';
        $scope.currentVisualisation = '';
        $scope.auth = AuthService;

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res){
            $scope.visualisationsList = res.data;
        });

        $scope.coursesList = [];

        $scope.$watch('auth.isAuthenticated()', function() {
            console.log($scope.auth.isAuthenticated());
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(d) {
                    $scope.coursesList = d;
                    Course.courseList = d;
                    if (d.length) {
                        $scope.currentCourse = d[0].id;
                        Course.currentCourse = d[0].id;
                    }

                    console.log(Course.currentCourse);
                });
            }
        });

        $scope.$watch('currentCourse', function() {
            Course.currentCourse = $scope.currentCourse;
        });
    }]);
