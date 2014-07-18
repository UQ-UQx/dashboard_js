'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */

angular.module('dashboardJsApp')
	.factory('RequestService', ['$http', 'AuthService', 'createDialog', function($http, AuthService, createDialogService) {
		return {
			async: function(url) {
				// $http returns a promise, which has a then function, which also returns a promise
				var promise = $http({
					url: url,
					type: 'GET',
					headers: {
						'Authorization': 'JWT ' + AuthService.getToken(),
					}
				})
				.then(function(response) {
					return response.data;
				}, function(response) {
					if (response.status === 401) {
						AuthService.deleteToken();
					}					
				});

				// Return the promise to the controller
				return promise;
			}
		};
	}]);