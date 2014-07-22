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
        $scope.enrolment_data = [];
        $scope.populationData = [];
        $scope.course = Course;
        $scope.auth = AuthService;

        $scope.formatData = function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/students/countries/' + Course.currentCourse + '/').then(function(data) {
                    $scope.populationData = [];
                    $scope.enrolment_data = [];
                    for(var country in data) {
                        var popObject = {'country':country, 'value':data[country]['count'], 'percentage': data[country]['percentage']};
                        $scope.populationData.push(popObject);
                        var enrolObject = [country, data[country]['percentage'], data[country]['count']];
                        $scope.enrolment_data.push(enrolObject);

                    }
                    function percentage_compare(a,b) {
                      if (a[1] > b[1])
                         return -1;
                      if (a[1] < b[1])
                        return 1;
                      return 0;
                    }
                    $scope.enrolment_data.sort(percentage_compare);
                    console.log($scope.enrolment_data);
                });
            }
        };

        //$scope.$watch('auth.isAuthenticated()', $scope.formatData());
        $scope.$watch('course.currentCourse', $scope.formatData());
  	}]);