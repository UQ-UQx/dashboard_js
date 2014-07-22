'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('LoginCtrl', ['$scope', '$rootScope', 'AUTHEVENTS', 'AuthService', function ($scope, $rootScope, AUTHEVENTS, AuthService) {
	$scope.credentials = {
		username: '',
		password: '',
	};

	$scope.message = '';
	$scope.messageClass = '';

	$scope.login = function(credentials) {
		AuthService.login(credentials).then(function(user) {
			$scope.message = 'Successfully logged in!';
			$scope.messageClass = 'login-success';
			$scope.$modalCancel();
		}, function(res) {
			console.log(res);
			$scope.message = 'Username and/or password is incorrect!';
			$scope.messageClass = 'login-failed';
		});
	};
  }]);
