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
					$scope.ageData = $scope.formatBarData(data);
				});

                RequestService.async('http://api.uqxdev.com/api/students/fullages/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.fullAgeData = $scope.formatBarData(data, true);
				});

				RequestService.async('http://api.uqxdev.com/api/students/genders/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.genderData = $scope.formatPieData(data);
				});

				RequestService.async('http://api.uqxdev.com/api/students/educations/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.educationData = $scope.formatBarData(data);
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

		$scope.formatBarData = function(unformattedData,nosort) {
			var formattedData = [];
			var totalDataValue = 0;

			for (var key in unformattedData) {
				totalDataValue += unformattedData[key];
			}

			for (var key in unformattedData) {
				formattedData.push([key, Math.round(((unformattedData[key] / totalDataValue) * 100) * 100) / 100 , unformattedData[key]]);
			}
            if(!nosort) {
                formattedData.sort(function (a, b) {
                    return b[1] - a[1]
                });
            }

			return formattedData;
		};
	}]);