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
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'ngTouch',
		'ui.router',
		'fundoo.services',
		'base64'
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
				//templateUrl: 'visualisations/enrolmentmetadata/template.html',
				templateUrl: function(stateParams) { return 'visualisations/'+stateParams.visualisation+'/template.html'; },
				controllerProvider: function($stateParams) { return 'Visualisation_' + $stateParams.visualisation + '_Ctrl'; },
				//controller: 'VisualisationEnrolmentmetadataCtrl'
			});

		$urlRouterProvider.otherwise('dashboard');
  	})
	.controller('AppCtrl', ['$scope', '$state', 'createDialog', 'AuthService', function($scope, $state, createDialogService, AuthService) {
		$scope.$state = $state;
		$scope.currentUser = null;
		$scope.isAuthorised = AuthService.isAuthorised;

		$scope.setCurrentUser = function(user) {
			$scope.currentUser = user;
		};

		$scope.launchLoginModal = function() {
			createDialogService({
				id: 'loginDialog',
				templateUrl: 'views/login.html',
				title: 'Login',
				success: {},
				cancel: {},
				footerTemplate: false,
				backdrop: true,
			});
		};

		$scope.launchLoginModal();
	}]);