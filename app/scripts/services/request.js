'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */

angular.module('dashboardJsApp')
	.factory('RequestService', ['$http', 'AuthService', function($http, AuthService) {
		return {
			async: function(url) {
    			// $http returns a promise, which has a then function, which also returns a promise
    			var promise = $http({
    				url: url,
    				type: 'GET',
    				headers: {
    					'Authorization': AuthService.getAuthHeader()
    				}
      			}).then(function (response) {
        			// The return value gets picked up by the then in the controller.
        			return response.data;
    			});

      			// Return the promise to the controller
      			return promise;
			}
		};
	}]);