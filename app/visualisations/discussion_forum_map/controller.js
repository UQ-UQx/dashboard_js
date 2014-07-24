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
		$scope.populationData = [{ 'country' : 'AU', 'value': '10', 'percentage': '10'}, { 'country': 'US', 'value': '50', 'percentage': '40'}];
		$scope.colourString1 = '23, 148, 68';
		$scope.colourString2 = '255, 127, 127';
	}]);