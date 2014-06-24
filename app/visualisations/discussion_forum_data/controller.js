'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('Visualisation_discussion_forum_data_Ctrl', function ($scope) {
    $scope.newRegData = {
        data: [['United States', 23.8, ' 3299'],
        ['India', 10.6, ' 1472'],
        ['Australia', 5.2, ' 715'],
        ['United Kingdom', 3.9, ' 540'],
        ['Canada', 3.7, ' 519'],
        ['Spain', 3.3, ' 451'],
        ['Brazil', 2.8, ' 390'],
        ['Germany', 2.7, ' 378'],],
    };
    console.log('adsfasdf');
  });