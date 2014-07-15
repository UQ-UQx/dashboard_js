'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.Session
 * @description
 * # Session
 * Service in the dashboardJsApp.
 */
angular.module('dashboardJsApp')
	.service('Session', function Session() {
		this.create = function(authHeader, userId, userPass) {
			this.authHeader = authHeader;
			this.userId = userId;
			this.userPass = userPass;
		};

		this.destroy = function() {
			this.authHeader = null;
			this.userId = null;
			this.userPass = null;
		};

		return this;
	});
