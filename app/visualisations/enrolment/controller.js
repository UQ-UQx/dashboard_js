'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('Visualisation_enrolment_Ctrl', function ($scope) {
    $scope.newRegData = [{ x: '1987-01-04', y: 5 }, { x: '1987-01-05', y: 20 }, { x: '1987-01-06', y: 10 }, { x: '1987-01-07', y: 40 }, { x: '1987-01-08', y: 5 }, { x: '1987-01-09', y: 60 }];
  });
