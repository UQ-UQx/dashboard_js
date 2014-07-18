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
			/*	.success(function(data, status, header, config)) {
					promise.then(function(response)) {
						return(response);
					});

					return promise;
				}) */
				.success(function(data, status, headers, config) {

				})
				/*.then(function(response) {
					return response.data;
				}); */


/*
				.success = function(fn) {
   					promise.then(function(response) {
      					fn(response.data, response.status, response.headers, config);
    				});
    				return promise;
				};  */

				.error(function(data, status, headers, config) {
					//console.log(status);

					if (status === 401) {
					/*	var launchLoginModal = function() {
							createDialogService({
								id: 'loginDialog',
								templateUrl: 'views/login.html',
								title: 'Login',
								footerTemplate: '<div></div>',
								backdrop: true,
								controller: 'LoginCtrl',
								css: {
									top: '100px',
									margin: '0 auto'
								}
							});
						};

						launchLoginModal(); */

						AuthService.deleteToken();
					}

					return data;
				});

				// Return the promise to the controller
				return promise;
			}
		};
	}]);