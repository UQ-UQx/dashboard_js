'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.Authservice
 * @description
 * # Authservice
 * Service in the dashboardJsApp.
 */
angular.module('dashboardJsApp')
	.factory('AuthService', ['$http', 'Session', 'Token', '$base64', function($http, Session, Token, $base64) {
    	var authService = {};

    	authService.login = function(credentials) {
            return $http({
                url: 'http://api.uqxdev.com/api-token-auth/',
                method: 'POST',
                data: {
                    'username': credentials.username,
                    'password': credentials.password,
                }
            }).then(function(res) {
                var returnedToken = '';

                try {
                    returnedToken = res.data.token;
                } catch(e) {
                    return '';
                }

                Token.create(returnedToken, credentials.username);
                Token.saveAsCookie();

                return credentials.username;
            });
    	};

        authService.logout = function() {
            this.deleteToken();
            document.location.reload();
        };

    	authService.isAuthenticated = function() {
    		return !!Token.token;
    	};

        authService.getToken = function() {
            return (Token.token ? Token.token : '');
        };

        authService.loadTokenCookie = function() {
            return Token.loadFromCookie();
        };

        authService.getUserId = function() {
            return Token.username;
        };

        authService.deleteToken = function() {
            Token.destroy();
        };

		return authService;
	}]);