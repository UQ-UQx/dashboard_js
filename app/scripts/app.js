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
		'base64',
		'ngCookies',
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
	.controller('AppCtrl', ['$scope', '$state', 'createDialog', 'AuthService', 'Session', function($scope, $state, createDialogService, AuthService, Session) {
		$scope.$state = $state;
		$scope.currentUser = null;
		$scope.isAuthorised = AuthService.isAuthorised;
		$scope.currentSession = Session;

		//$scope.$watch(Sessio
		$scope.$watch('currentSession.authHeader', function() {
			$scope.currentUser = $scope.currentSession.userId;
		});

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

		console.log(Session);

		$scope.launchLoginModal();
		console.log($scope);
	}])
	.controller('TestCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
		console.log($scope);
		console.log($rootScope);
	}]);