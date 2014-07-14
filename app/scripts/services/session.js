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
		this.create = function(sessionId, userId) {
			this.id = sessionId;
			this.userId = userId;
		};
		this.destroy = function() {
			this.id = null;
			this.userId = null;
		};

		return this;
	});
