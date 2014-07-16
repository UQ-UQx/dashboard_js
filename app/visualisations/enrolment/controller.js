'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolment_Ctrl', ['$scope', 'requestService', function ($scope, requestService) {
        

		$scope.newRegData = [{
    		name: 'Total' ,
    		data: [{ date: '1987-01-04', value: 5 }, { date: '1987-01-05', value: 20 }, { date: '1987-01-06', value: 10 }, { date: '1987-01-07', value: 40 }, { date: '1987-01-08', value: 5 }, { date: '1987-01-09', value: 60 }]
    	}, {
    		name: 'Still Enrolled',
    		data: [{ date: '1987-01-04', value: 15 }, { date: '1987-01-05', value: 10 }, { date: '1987-01-06', value: 40 }, { date: '1987-01-07', value: 30 }, { date: '1987-01-08', value: 5 }, { date: '1987-01-09', value: 15 }]
    	}, {
    		name: 'Another Line',
    		data: [{ date: '1987-01-04', value: 20 }, { date: '1987-01-05', value: 30 }, { date: '1987-01-06', value: 20 }, { date: '1987-01-07', value: 22 }, { date: '1987-01-08', value: 13 }, { date: '1987-01-09', value: 14 }]
    	}, {
    		name: 'Yet Another',
    		data: [{ date: '1987-01-02', value: 10 }, { date: '1987-01-05', value: 20 }, { date: '1987-01-06', value: 5 }, { date: '1987-01-07', value: 16 }, { date: '1987-01-08', value: 15 }, { date: '1987-01-09', value: 45 }]
    	}];

        $scope.blah = [{
    		name: 'Total' ,
    		data: [{ date: '1987-01-04', value: 5 }, { date: '1987-01-05', value: 20 }, { date: '1987-01-06', value: 10 }, { date: '1987-01-07', value: 40 }, { date: '1987-01-08', value: 5 }, { date: '1987-01-09', value: 60 }]
    	}, {
    		name: 'Still Enrolled',
    		data: [{ date: '1987-01-04', value: 15 }, { date: '1987-01-05', value: 10 }, { date: '1987-01-06', value: 40 }, { date: '1987-01-07', value: 30 }, { date: '1987-01-08', value: 5 }, { date: '1987-01-09', value: 15 }]
    	}, {
    		name: 'Another Line',
    		data: [{ date: '1987-01-04', value: 20 }, { date: '1987-01-05', value: 30 }, { date: '1987-01-06', value: 20 }, { date: '1987-01-07', value: 22 }, { date: '1987-01-08', value: 13 }, { date: '1987-01-09', value: 14 }]
    	}, {
    		name: 'Yet Another',
    		data: [{ date: '1987-01-02', value: 10 }, { date: '1987-01-05', value: 20 }, { date: '1987-01-06', value: 5 }, { date: '1987-01-07', value: 16 }, { date: '1987-01-08', value: 15 }, { date: '1987-01-09', value: 45 }]
    	}];
  	}]);