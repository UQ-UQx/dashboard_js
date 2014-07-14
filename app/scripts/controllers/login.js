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

    $scope.login = function(credentials) {
        console.log(credentials);
    	AuthService.login(credentials).then(function(user) {
    		$rootScope.$broadcast(AUTHEVENTS.loginSuccess);
    		$rootScope.setCurrentUser(user);
    	}, function() {
    		$rootScope.$broadcast(AUTHEVENTS.loginFailed);
    	});
    };
  }]);
