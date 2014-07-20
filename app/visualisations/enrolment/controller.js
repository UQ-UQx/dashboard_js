'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolment_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
        $scope.normalData = [];
        $scope.aggregateData = [];
        $scope.course = Course;
        $scope.auth = AuthService;

        $scope.formatData = function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/students/dates/' + Course.currentCourse + '/').then(function(data) {
                    var formattedNormalData = [{ name: 'Active', data: [] }, { name: 'Enrolled', data: [] }];
                    var formattedAggregateData = [{ name: 'Aggregate Active', data: [] }, { name: 'Aggregate Enrolled', data: [] }];

                    for (var key in data) {
                        formattedNormalData[0].data.push({ date: key, value: data[key].active });
                        formattedNormalData[1].data.push({ date: key, value: data[key].enrolled });
                        formattedAggregateData[0].data.push({ date: key, value: data[key].aggregate_active });
                        formattedAggregateData[1].data.push({ date: key, value: data[key].aggregate_enrolled });
                    }

                    $scope.normalData = formattedNormalData;
                    $scope.aggregateData = formattedAggregateData;
                });
            }
        };

        //$scope.$watch('auth.isAuthenticated()', $scope.formatData());
        $scope.$watch('course.currentCourse', $scope.formatData());
  	}]);