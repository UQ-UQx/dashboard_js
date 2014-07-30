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
            .state('reports', {
				url: '/reports',
				templateUrl: 'views/reports.html',
				controller: 'ReportsCtrl'
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
				}
			})
            .state('reports.report', {
				url: '/:report',
				templateUrl: function(stateParams) {
					return 'reports/' + stateParams.report + '/template.html';
				},
				controllerProvider: function($stateParams) {
					return 'Report_' + $stateParams.report + '_Ctrl';
				}
			});

		$urlRouterProvider.otherwise('dashboard');
  	})
	.controller('AppCtrl', ['$scope', '$state', 'createDialog', 'AuthService', '$routeParams', function($scope, $state, createDialogService, AuthService, $routeParams) {
		$scope.$state = $state;

        $scope.embed = false;

        for(var key in getUrlVars()) {
            if(key == 'embed') {
                $scope.embed = true;
            }
        }
		$scope.currentUser = null;
		$scope.auth = AuthService;
		$scope.isAuthorised = $scope.auth.isAuthenticated();

		$scope.$watch('auth.isAuthenticated()', function() {
			$scope.currentUser = $scope.auth.getUserId();
		});

        $scope.mainNavChanged = function() {
            $scope.$broadcast('nav_clicked');
        }

		$scope.userLogout = function() {
            $scope.$broadcast('broadcast_logout');
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
            setTimeout(function () {
                $scope.$broadcast('broadcast_logout');
            },100);
		}
	}]);

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}