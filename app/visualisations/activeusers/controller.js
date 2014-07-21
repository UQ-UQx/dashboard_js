'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_activeusers_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
		$scope.normalData = [];
		$scope.aggregateData = [];
		$scope.course = Course;
		$scope.auth = AuthService;

		$scope.formatData = function() {
			if ($scope.auth.isAuthenticated()) {
				RequestService.async('http://api.uqxdev.com/api/students/active/' + Course.currentCourse + '/').then(function(data) {
					console.log(data);
					var formattedDailyData = [{ name: 'Daily', data: [] }];
					var formattedWeeklyData = [{ name: 'Weekly', data: [] }];

					for (var day in data['days']) {
						formattedDailyData[0].data.push({ date: day, value: data['days'][day] });
					}

					for (var week in data['weeks']) {
						formattedWeeklyData[0].data.push({ date: week, value: data['weeks'][week] });
					}

					$scope.dailyData = formattedDailyData;
					$scope.weeklyData = formattedWeeklyData;
				});
			}
		};

		//$scope.$watch('auth.isAuthenticated()', $scope.formatData());
		$scope.$watch('course.currentCourse', $scope.formatData());
	}]);