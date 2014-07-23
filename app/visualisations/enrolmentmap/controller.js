'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolmentmap_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
        $scope.enrolmentData = [];
        $scope.populationData = [];
        $scope.auth = AuthService;
		$scope.colourString = '23, 60, 68';

        $scope.formatData = function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/students/countries/' + Course.currentCourse + '/').then(function(data) {
                    $scope.populationData = [];
                    $scope.enrolmentData = [];
                    for(var country in data) {
                        var popObject = {'country':country, 'value':data[country]['count'], 'percentage': data[country]['percentage']};
                        $scope.populationData.push(popObject);
                        var enrolObject = [country, data[country]['percentage'], data[country]['count']];
                        $scope.enrolmentData.push(enrolObject);

                    }
                    function percentage_compare(a,b) {
                      if (a[1] > b[1])
                         return -1;
                      if (a[1] < b[1])
                        return 1;
                      return 0;
                    }
                    $scope.enrolmentData.sort(percentage_compare);
                });
            }
        };

        $scope.$watch('course.currentCourse', $scope.formatData());
  	}]);