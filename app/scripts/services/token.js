'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.Token
 * @description
 * # Token
 * Service in the dashboardJsApp.
 */
angular.module('dashboardJsApp')
	.service('Token', ['ipCookie', function Token(ipCookie) {
		this.create = function(token, username) {
			this.token = token;
			this.username = username;
		};

		this.destroy = function() {
			this.token = null;
			this.username = null;
			ipCookie.remove('dashboard');
		};

		this.saveAsCookie = function() {
			if ((this.token !== undefined) && (this.token !== null)) {
				ipCookie('dashboard', {
					'token': this.token,
					'username': this.username,
				}, { expires: 30 });
				return this.token;
			}
			else {
				return false;
			}
		};

		this.loadFromCookie = function() {
			if ((ipCookie('dashboard') !== undefined) && (ipCookie('dashboard') !== null)) {
				var cookie = ipCookie('dashboard');
				this.token = cookie.token;
				this.username = cookie.username;
				return this.token;
			}
			else {
				return false;
			}
		};

		return this;
	}]);
