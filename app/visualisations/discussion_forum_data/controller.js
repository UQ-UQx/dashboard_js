'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('Visualisation_discussion_forum_data_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
    $scope.newRegData = [
                    ['United States', 23.8, ' 3299'],
                    ['India', 10.6, ' 1472'],
                    ['Australia', 5.2, ' 715'],
                    ['United Kingdom', 3.9, ' 540'],
                    ['Canada', 3.7, ' 519'],
                    ['Spain', 3.3, ' 451'],
                    ['Brazil', 2.8, ' 390'],
                    ['Germany', 2.7, ' 378'],
                    ['Poland', 2.1, ' 286'],
                    ['Mexico', 2.0, ' 272'],
                    ['Egypt', 1.9, ' 257'],
                    ['Colombia', 1.6, ' 222'],
                    ['France', 1.4, ' 192'],
                    ['Pakistan', 1.3, ' 186'],
                    ['Russian Federation', 1.3, ' 185'],
                    ['Greece', 1.3, ' 179'],
                    ['Italy', 1.2, ' 170'],
                    ['Netherlands', 1.1, ' 151'],
                    ['Portugal', 1.1, ' 146'],
                    ['China', 1.0, ' 145']];

    $scope.normalData = [];
    $scope.aggregateData = [];
    $scope.course = Course;
    $scope.auth = AuthService;

    $scope.formatData = function() {
        if ($scope.auth.isAuthenticated()) {
            RequestService.async('http://api.uqxdev.com/api/students/dates/' + Course.currentCourse + '/').then(function(data) {
                var formattedNormalData = [{ name: 'Active', data: [] }, { name: 'Enrolled', data: [] }];
                var formattedAggregateData = [{ name: 'Aggregate Active', data: [] }, { name: 'Aggregate Enrolled', data: [] }];

                for (var key in data) {
                    formattedNormalData[0].data.push({ date: key, value: data[key].active });
                    formattedNormalData[1].data.push({ date: key, value: data[key].enrolled });
                    formattedAggregateData[0].data.push({ date: key, value: data[key].aggregate_active });
                    formattedAggregateData[1].data.push({ date: key, value: data[key].aggregate_enrolled });
                }

                $scope.normalData = formattedNormalData;
                $scope.aggregateData = formattedAggregateData;
            });
        }
    };

        //$scope.$watch('auth.isAuthenticated()', $scope.formatData());
        $scope.$watch('course.currentCourse', $scope.formatData());


    /*
    $scope.chartOption = {
    //    barFill: "blue",
    //    highlightFill: "red",
    //    tipOn: false,
    };
    */
  }]);