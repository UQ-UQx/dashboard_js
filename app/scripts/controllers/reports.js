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

        $scope.course = Course;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;

        $scope.current_date = today;

        $http.get('reports.json').then(function(res) {
            $scope.reportsList = res.data;
            console.log("###");
            console.log($scope);
            if ($scope.currentReport !== '') {
                for (var rep in $scope.reportsList) {
                    if($scope.currentReport == $scope.reportsList[rep].id) {
                        $scope.currentReportName = $scope.reportsList[rep].name;
                    }
                }
            }
        });

        $scope.currentReport = $state.params.report;

        $scope.changeReport = function(newReport) {
            $scope.currentReport = newReport.id;
            $scope.currentReportName = newReport.name;
            console.log("CHANGING REPORT");
        }

        if ($scope.auth.isAuthenticated()) {

            //$scope.$parent.state = "running";

            console.log("REPORT LOADING");

        }
  }]);