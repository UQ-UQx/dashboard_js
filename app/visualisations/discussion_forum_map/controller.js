'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_discussion_forum_map_Ctrl', ['$scope', 'RequestService', function ($scope, RequestService) {
		$scope.populationData = [{ 'country' : 'AU', 'value': '10', 'percentage': '10'}, { 'country': 'US', 'value': '50', 'percentage': '40'}];
		$scope.colourRange = ['#e62e65', '#e62e9c', '#e62ed3', '#c12ee6', '#8a2ee6', '#532ee6', '#2e40e6', '#2e77e6', '#2eaee6', '#2ee6e6', '#2ee6ae', '#2ee677', '#2ee640', '#53e62e', '#8ae62e', '#c1e62e', '#e6d32e', '#e69c2e', '#e6652e', '#e62e2e'];
		$scope.colourString1 = '23, 60, 68';
		$scope.colourString2 = '10, 150, 150';
		$scope.colourString3 = '30, 60, 50';
		
	}]);