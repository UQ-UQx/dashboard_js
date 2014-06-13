'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('Visualisation_enrolmentmetadata_Ctrl', ['$scope', 'requestService', function ($scope, requestService) {

        requestService.async('http://localhost/testdata.php').then(function(d) {
            $scope.data = d;
        });
    console.log("HELLO ENROLMENT METADATA");
  }]);