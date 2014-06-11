'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('DashboardCtrl', ['$scope','$http','requestService', function ($scope, $http, requestService) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.currentCourse = 'UQx_BIOIMG101x_1T2014';
        $scope.currentVisualisation = '';

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res){
            console.log(res.data);
            $scope.visualisationsList = res.data;
        });


        $scope.coursesList = [];
        requestService.async('http://localhost/courses.php').then(function(d) {
            $scope.coursesList = d.response;
        });
    }]);
