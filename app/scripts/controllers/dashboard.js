'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description'
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('DashboardCtrl', ['$scope','$http','RequestService', 'AuthService', 'Course', function ($scope, $http, RequestService, AuthService, Course) {

        //Fix later

        $scope.currentVisualisation = '';
        $scope.currentVisualisationName = "No Visualisation Selected";
        $scope.auth = AuthService;
        $scope.course = Course;

        $scope.course.currentCourse = 'hypers_301x_1T2014';

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res){
            $scope.visualisationsList = res.data;
            console.log(res.data);
        });

        $scope.courseList = [];

        $scope.changeVisualisation = function(newVisualisation) {
            $scope.currentVisualisation = newVisualisation.id;
            $scope.currentVisualisationName = newVisualisation.name;
        }

        $scope.$watch('auth.isAuthenticated()', function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(data) {
                    $scope.course.courseList = data.data;
                    for (var i in $scope.course.courseList) {
                        var shortName = $scope.course.courseList[i].name.split(" ");
                        shortName.pop();
                        shortName = shortName.join(" ");
                        shortName = shortName.charAt(0).toUpperCase() + shortName.slice(1);
                        $scope.course.courseList[i].shortName = shortName;
                    }
                    if (data.length) {
                        $scope.course.currentCourse = data[0].id;
                    }
                    else {
                        $scope.course.currentCourse = '';
                    }
                });
            }
        });
    }]);
