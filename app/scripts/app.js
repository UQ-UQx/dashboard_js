'use strict';

/**
 * @ngdoc overview
 * @name dashboardJsApp
 * @description
 * # dashboardJsApp
 *
 * Main module of the application.
 */
angular
  .module('dashboardJsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
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
        controllerProvider: function($stateParams) { return "Visualisation_" + $stateParams.visualisation + "_Ctrl"; },
        //controller: 'VisualisationEnrolmentmetadataCtrl'
    });
    $urlRouterProvider.otherwise('dashboard');
  })
  .controller('AppCtrl', function ($scope, $state) {
    $scope.$state = $state;
  });