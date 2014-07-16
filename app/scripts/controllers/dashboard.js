'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('DashboardCtrl', ['$scope','$http','requestService', 'AuthService', function ($scope, $http, requestService, AuthService) {
        $scope.currentCourse = 'UQx_BIOIMG101x_1T2014';
        $scope.currentVisualisation = '';
        $scope.auth = AuthService;

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res){
            $scope.visualisationsList = res.data;
        });

        $scope.coursesList = [];

        $scope.$watch('auth.isAuthenticated()', function() {
            console.log($scope.auth.isAuthenticated());
            if ($scope.auth.isAuthenticated()) {
                requestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(d) {
                    $scope.coursesList = d;
                    console.log(d);
                });
            }
        });
    }]);
