'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('Visualisation_apachelogs_Ctrl', function ($scope) {
    $scope.newRegData = {
        xAxisName: "State",
        xTicks: ["AL", "AK", "AZ"],
        yAxisName: "Population",
        stackNames: ["Under 5 Years", "5 to 13 Years", "14 to 17 Years"],
        stackData: [
          [
            { x: "AL", y: 310504, comment: "comments here." },
            { x: "AK", y: 52083 },
            { x: "AZ", y: 515910}
          ],
          [
            { x: "AL", y: 552339 },
            { x: "AK", y: 85640 },
            { x: "AZ", y: 828669}
          ],
          [
            { x: "AL", y: 259034 },
            { x: "AK", y: 42153 },
            { x: "AZ", y: 362642}
          ],
        ]
    }

/*
    $scope.chartOption = {
        colors: ["#98abc5", "#8a89a6", "#7b6888"],
        legendOn: false,
        legendPosition: 'right',                 // Can be "left", "middle", "right" or (0-1)
        rulesOn: false,
        tipOn: false,
    };
*/
  });