'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.Authservice
 * @description
 * # Authservice
 * Service in the dashboardJsApp.
 */
angular.module('dashboardJsApp')
	.factory('AuthService', ['$http', 'Session', '$base64', function($http, Session, $base64) {
    	var authService = {};

    	authService.login = function(credentials) {
            return $http({
                url: 'http://api.uqxdev.com/',
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(credentials.username + ':' + credentials.password),
                },
            }).then(function(res) {
                console.log(res);
                Session.create(res.id, res.user.id);
                return res.user;
            });
    	};

    	authService.isAuthenticated = function() {
    		return !!Session.userId;
    	};

		authService.isAuthorised = function() {
			// TODO: Accept
		/*	if (!angular.isArray(authorisedList)) {
				authorisedRoles = [authorisedRoles];
			}
			return (authService.isAuthenticated && authorisedList.indexOf(Session.)) */

			return 1;
		};

		return authService;
	}]);