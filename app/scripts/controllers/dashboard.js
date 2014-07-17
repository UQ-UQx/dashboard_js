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
        $scope.currentVisualisation = '';
        $scope.auth = AuthService;
        $scope.course = Course;

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res){
            $scope.visualisationsList = res.data;
        });

        $scope.courseList = [];

        $scope.$watch('auth.isAuthenticated()', function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(data) {
                    $scope.course.courseList = data;
                    if (data.length) {
                        $scope.course.currentCourse = data[0].id;
                    }
                    else {
                        $scope.course.currentCourse = '';
                    }
                });
            }
        });
    }]);
