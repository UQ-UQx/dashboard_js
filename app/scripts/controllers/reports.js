'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('ReportsCtrl', ['$scope','$http','RequestService', 'AuthService', 'Course', '$state', function ($scope, $http, RequestService, AuthService, Course, $state) {

        $scope.currentReport = '';
        $scope.currentReportName = '';
        $scope.reportsList = [];
        $scope.courseList = [];

        $scope.state = "loading";

        $http.get('reports.json').then(function(res) {
            $scope.reportsList = res.data;
            console.log($scope);
//            if ($scope.currentReport !== '') {
//                for (var vis in $scope.reportsList) {
//                    if($scope.currentVisualisation == $scope.visualisationsList[vis].id) {
//                        $scope.currentVisualisationName = $scope.visualisationsList[vis].name;
//                    }
//                }
//            }
        });

        $scope.changeReport = function(newReport) {
            $scope.currentReport = newReport.id;
            $scope.currentReportName = newReport.name;
            console.log("CHANGING REPORT");
        }

        if ($scope.auth.isAuthenticated()) {

            //$scope.$parent.state = "running";

            console.log("REPORT LOADING");

            //Courses
//            RequestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(data) {
//                console.log("CHANGING XXX "+$scope.course.currentCourse);
//                $scope.course.setCourseList(data);
//                if($scope.state == 'running' && $scope.auth.justLoggedIn) {
//                    $state.go($state.current, {}, {reload: true});
//                }
//                $scope.auth.justLoggedIn = false;
//            });
        }
  }]);