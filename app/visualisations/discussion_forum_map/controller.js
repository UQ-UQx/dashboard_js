'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_discussion_forum_map_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
		$scope.auth = AuthService;

        $scope.$parent.state = 'loading';

		$scope.$watch('auth.isAuthenticated()', function() {
			if ($scope.auth.isAuthenticated()) {
				RequestService.async('http://api.uqxdev.com/api/discussions/countries/' + Course.currentCourse + '/').then(function(data) {
					$scope.populationData = [];
					$scope.populationEnrolData = [];
					$scope.postColour = '23, 148, 68';
					$scope.postEnrolColour = '255, 127, 127';

					if ('country_post' in data) {
						for (var key in data['country_post']) {
							$scope.populationData.push({ country: data['country_post'][key][0], value: data['country_post'][key][1], percentage: data['country_post'][key][1] })
						}

						for (var key in data['country_post_enrol']) {
							$scope.populationEnrolData.push({ country: data['country_post_enrol'][key][0], value: data['country_post_enrol'][key][1], percentage: data['country_post_enrol'][key][3]})
						}
					}

                    $scope.$parent.state = 'running';
				});
			}
		});
	}]);