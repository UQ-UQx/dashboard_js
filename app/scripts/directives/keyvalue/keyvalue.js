'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */

app.directive('visKeyValue', function() {
        return {
            restrict: 'EA',
            scope: {
                data: '=data'
            },
            templateUrl: 'scripts/directives/keyvalue/keyvalue.html'
        };
    });