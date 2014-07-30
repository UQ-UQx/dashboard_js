'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('Visualisation_enrolmentmetadata_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
        $scope.auth = AuthService;

        $scope.$parent.state = "loading";


        $scope.refresh = false;
        $scope.refreshData = function() {
            $scope.$parent.state = "loading";
            $scope.refresh = true;
            $scope.loadData();
            $scope.refresh = false;
        }

        $scope.loadData = function() {

            var refresh = '';

            if($scope.refresh) {
                refresh = '?refreshcache=true';
            }

            if ($scope.auth.isAuthenticated()) {
                console.log(refresh);
                RequestService.async('http://api.uqxdev.com/api/students/ages/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    $scope.ageData = $scope.formatPieData(data);
                });

                RequestService.async('http://api.uqxdev.com/api/students/genders/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    $scope.genderData = $scope.formatPieData(data);
                });

                RequestService.async('http://api.uqxdev.com/api/students/educations/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    $scope.educationData = $scope.formatPieData(data);
                });

                RequestService.async('http://api.uqxdev.com/api/students/modes/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    delete data['total'];
                    $scope.enrolTypeData = $scope.formatPieData(data);
                });
                $scope.$parent.state = "running";
            }
        }

        $scope.$watch('auth.isAuthenticated()', $scope.loadData, true);

        $scope.formatPieData = function(unformattedData) {
            var formattedData = [];

            for (var key in unformattedData) {
                formattedData.push({ label: key, value: unformattedData[key] });
            }

            return formattedData;
        };
  }]);