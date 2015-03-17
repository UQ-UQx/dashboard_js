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
                url = APIBASE + url;
                var headers = {};
                if(AuthService.getToken()) {
                    headers = {'Authorization': 'JWT ' + AuthService.getToken()}
                    console.log("CCC");
                    console.log(headers);
                }
                url = url.replace("allcourses/","");
				// $http returns a promise, which has a then function, which also returns a promise
				var promise = $http({
					url: url,
					type: 'GET',
					headers: headers,
				})
				.then(function(response) {
					return response.data;
				}, function(response) {
					if (response.status === 401) {
						AuthService.deleteToken();
                        console.log("BAD BAD NEED TO REAUTH");
                        location.reload();
					}
				});

				// Return the promise to the controller
				return promise;
			}
		};
	}]);