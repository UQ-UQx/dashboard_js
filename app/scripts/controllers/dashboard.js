'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description'
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('DashboardCtrl', ['$scope','$http','RequestService', 'AuthService', 'Course', '$state', function ($scope, $http, RequestService, AuthService, Course, $state) {
	    console.log('dashboard.js');
        $scope.currentVisualisation = '';
        $scope.currentVis = '';
        $scope.currentVisualisationName = '';
        $scope.auth = AuthService;
        $scope.course = Course;
        $scope.state = "notselected";

        $scope.visualisationsList = [];
        $http.get('visualisations.json').then(function(res) {
            $scope.visualisationsList = res.data;
            if ($scope.currentVisualisation !== '') {
                for (var vis in $scope.visualisationsList) {
                    if($scope.currentVisualisation == $scope.visualisationsList[vis].id) {
                        $scope.currentVisualisationName = $scope.visualisationsList[vis].name;
                    }
                }
            }
        });

        $scope.course.currentCourse = $state.params.course;
        $scope.currentVisualisation = $state.params.visualisation;
        $scope.year = 'all';

        $scope.$watch('state',function() {
            if($scope.course.currentCourse == '') {
                $scope.state = 'notselected';
            }
        });

        $scope.$on('nav_clicked', function() {
            $scope.goHome();
        });

        $scope.$on('broadcast_logout', function() {
            $scope.state = 'notloggedin';
        });

        $scope.changeVisualisation = function(newVisualisation) {
            $scope.currentVisualisation = newVisualisation.id;
            $scope.currentVisualisationName = newVisualisation.name;
        }

        $scope.goHome = function() {
            $scope.currentVisualisation = '';
            $scope.currentVisualisationName = '';
            $scope.course.currentCourse = '';
            $scope.state = 'notselected';
        }

        $scope.changeYear = function() {
            console.log($scope.year);
        }

        $scope.$watch('auth.isAuthenticated()', function() {
            if ($scope.auth.isAuthenticated()) {
                RequestService.async('/meta/courses/').then(function(data) {
                    if(!$scope.course.currentCourse || $scope.course.currentCourse == '') {
                        $scope.state = 'notselected';
                    } else {
                        $scope.state = "running";
                    }
                    $scope.course.setCourseList(data);
                    if($scope.state == 'running' && $scope.auth.justLoggedIn) {
                        $state.go($state.current, {}, {reload: true});
                    }
                    $scope.auth.justLoggedIn = false;
                    /*
                    if (data.length) {
                        $scope.course.currentCourse = data[0].id;
                    }
                    else {
                        $scope.course.currentCourse = '';
                    } */
                    //$scope.changeVisualisation({'id':$scope.currentVisualisation,'name':$scope.currentVisualisationName});
                });
            }
        });
    }]);
