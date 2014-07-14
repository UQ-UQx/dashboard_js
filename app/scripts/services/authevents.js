'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.AUTHEVENTS
 * @description
 * # AUTHEVENTS
 * Constant in the dashboardJsApp.
 */
 angular.module('dashboardJsApp')
 	.constant('AUTHEVENTS', {
 		loginSuccess: 'auth-login-success',
 		loginFailed: 'auth-login-failed',
 		logoutSuccess: 'auth-logout-success',
 		sessionTimeout: 'auth-session-timeout',
 		notAuthenticated: 'auth-not-authenticated',
 		notAuthorized: 'auth-not-authorized'
	});
