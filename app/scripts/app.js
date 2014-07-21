'use strict';

/**
 * @ngdoc overview
 * @name dashboardJsApp
 * @description
 * # dashboardJsApp
 *
 * Main module of the application.
 */

var app = angular
	.module('dashboardJsApp', [
		'ngAnimate',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ui.router',
		'fundoo.services',
		'base64',
		'ipCookie',
	])
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: 'views/dashboard.html',
				controller: 'DashboardCtrl'
			})
			.state('explorer', {
				url: '/explorer',
				templateUrl: 'views/explorer.html',
				controller: 'ExplorerCtrl'
			})
			.state('status', {
				url: '/status',
				templateUrl: 'views/status.html',
				controller: 'StatusCtrl'
			})
			.state('dashboard.visualisation', {
				url: '/:visualisation/:course',
				templateUrl: function(stateParams) {
					return 'visualisations/' + stateParams.visualisation + '/template.html';
				},
				controllerProvider: function($stateParams, Course) {
					Course.currentCourse = $stateParams.course;
					return 'Visualisation_' + $stateParams.visualisation + '_Ctrl';
				},
			});

		$urlRouterProvider.otherwise('dashboard');
  	})
	.controller('AppCtrl', ['$scope', '$state', 'createDialog', 'AuthService', function($scope, $state, createDialogService, AuthService) {
		$scope.$state = $state;
		$scope.$watch('state', function() {
			console.log($scope.state);
		});
		$scope.currentUser = null;
		$scope.auth = AuthService;
		$scope.isAuthorised = $scope.auth.isAuthenticated();

		$scope.$watch('auth.isAuthenticated()', function() {
			$scope.currentUser = $scope.auth.getUserId();
		});

		$scope.userLogout = function() {
			console.log('adsfasdf');
			AuthService.logout();
		};

		$scope.launchLoginModal = function() {
			createDialogService({
				id: 'loginDialog',
				templateUrl: 'views/login.html',
				title: 'Login',
				footerTemplate: '<div></div>',
				backdrop: true,
				controller: 'LoginCtrl',
				css: {
					top: '100px',
					margin: '0 auto'
				}
			});
		};

		var token = AuthService.loadTokenCookie();

		if (!token) {
			$scope.launchLoginModal();
		}
	}]);