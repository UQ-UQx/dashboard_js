'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description'
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('DashboardCtrl', ['$scope','$http','RequestService', 'AuthService', 'Course', '$state', function ($scope, $http, RequestService, AuthService, Course, $state) {
        $scope.currentVisualisation = '';
        $scope.currentVisualisationName = '';
        $scope.auth = AuthService;
        $scope.course = Course;
        $scope.state = "notselected";

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res) {
            $scope.visualisationsList = res.data;
            if ($scope.currentVisualisation !== '') {
                for (var vis in $scope.visualisationsList) {
                    if($scope.currentVisualisation == $scope.visualisationsList[vis].id) {
                        $scope.currentVisualisationName = $scope.visualisationsList[vis].name;
                    }
                }
            }
        });

        $scope.course.currentCourse = $state.params.course;
        $scope.currentVisualisation = $state.params.visualisation;

        $scope.courseList = [];

        $scope.changeVisualisation = function(newVisualisation) {
            $scope.currentVisualisation = newVisualisation.id;
            $scope.currentVisualisationName = newVisualisation.name;
        }

        $scope.goHome = function() {
            $scope.currentVisualisation = '';
            $scope.currentVisualisationName = '';
            $scope.course.currentCourse = '';
        }

        $scope.$watch('auth.isAuthenticated()', function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(data) {
                    $scope.course.setCourseList(data);
                    /*
                    if (data.length) {
                    //    $scope.course.currentCourse = data[0].id;
                    }
                    else {
                        $scope.course.currentCourse = '';
                    } */
                });
            }
        });
    }]);
