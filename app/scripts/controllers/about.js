'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
