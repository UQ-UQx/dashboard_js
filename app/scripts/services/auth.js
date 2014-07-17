'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.Authservice
 * @description
 * # Authservice
 * Service in the dashboardJsApp.
 */
angular.module('dashboardJsApp')
	.factory('AuthService', ['$http', 'Session', '$base64', '$cookies', function($http, Session, $base64, $cookies) {
    	var authService = {};


        console.log($cookies);
  /*      var cn = 'Authorization=';
        console.log(document.cookie.indexOf(cn)); */

    	authService.login = function(credentials) {
            return $http({
                url: 'http://api.uqxdev.com/api/',
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(credentials.username + ':' + credentials.password),
                },
            }).then(function(res) {
                var authHeaderSplit = res.config.headers.Authorization.split(' ');
                var encodedCred = authHeaderSplit[1];
                var decodedCred = $base64.decode(encodedCred);
                var username = decodedCred.split(':')[0];
                var password = decodedCred.split(':')[1];

                Session.create(res.config.headers.Authorization, username, password);

                return username;
            });
    	};

    	authService.isAuthenticated = function() {
    		return !!Session.userId;
    	};

        authService.getAuthHeader = function() {
            return (Session.authHeader ? Session.authHeader : '');
        };

        authService.getUserId = function() {
            return (Session.userId ? Session.userId : '');
        };

		return authService;
	}]);