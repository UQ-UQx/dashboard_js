'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolmentmap_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', 'COUNTRY', function ($scope, RequestService, Course, AuthService, COUNTRY) {
		$scope.enrolmentData = [];
		$scope.populationData = [];
		$scope.auth = AuthService;
		$scope.colourString = '23, 60, 68';

		$scope.$parent.state = "loading";

		$scope.$watch('auth.isAuthenticated()', function() {

			var twodtoname = {};
			for(var country in COUNTRY) {
				twodtoname[COUNTRY[country]['alpha-2']] = COUNTRY[country]['name'];
			}

			if ($scope.auth.isAuthenticated()) {
				RequestService.async('http://api.uqxdev.com/api/students/countries/' + Course.currentCourse + '/').then(function(data) {
					$scope.populationData = [];
					$scope.enrolmentData = [];
					var tmpEnrolmentData = [];
					for(var country in data) {
						if(country != 'null') {
							var roundedPercentage = Math.round(data[country]['percentage']*100)/100;
							var popObject = {'country': country, 'value': data[country]['count'], 'percentage': roundedPercentage};
							$scope.populationData.push(popObject);
							var enrolObject = [twodtoname[country], roundedPercentage, data[country]['count']];
							tmpEnrolmentData.push(enrolObject);
						}
					}
					function percentage_compare(a,b) {
					  if (a[1] > b[1])
						 return -1;
					  if (a[1] < b[1])
						return 1;
					  return 0;
					}
					tmpEnrolmentData.sort(percentage_compare);
					for(country in tmpEnrolmentData) {
						if(tmpEnrolmentData[country][1] < 1) {
							break;
						}
						$scope.enrolmentData.push(tmpEnrolmentData[country]);
					}
				});
				$scope.$parent.state = "running";
			}
		});
	}]);