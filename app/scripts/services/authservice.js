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
        var cn = 'Authorization=';
        console.log(document.cookie.indexOf(cn));

    	authService.login = function(credentials) {
            console.log('asdfadsfadsfadsfadsf');
            return $http({
                url: 'http://api.uqxdev.com/',
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + $base64.encode(credentials.username + ':' + credentials.password),
                },
            }).then(function(res) {
                console.log(res);
                console.log(res.config.headers.Authorization);

                var authHeaderSplit = res.config.headers.Authorization.split(' ');
                var encodedCred = authHeaderSplit[1];
                var decodedCred = $base64.decode(encodedCred);
                var username = decodedCred.split(':')[0];
                var password = decodedCred.split(':')[1];
                var user = {};

                console.log(username);
                console.log(password);

                user.username = username;

                Session.create(res.config.headers.Authorization, username, password);
                console.log(Session.authHeader);
                return user;
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