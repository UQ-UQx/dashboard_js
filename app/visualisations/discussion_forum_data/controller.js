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
	/*$scope.newRegData = [
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
 
	$scope.normalData = []; */
	//$scope.aggregateData = [];
	$scope.course = Course;
	$scope.auth = AuthService;
	$scope.$parent.state = "loading";

    $scope.refresh = false;
    $scope.refreshData = function() {
        $scope.$parent.state = "loading";
        $scope.refresh = true;
        $scope.loadData();
        $scope.refresh = false;
    }

    $scope.loadData = function() {

        var refresh = '';

        if($scope.refresh) {
            refresh = '?refreshcache=true';
        }

        if ($scope.auth.isAuthenticated()) {

            if(Course.currentCourse == 'allcourses') {
                $scope.$parent.state = "notavailable";
            } else {

                RequestService.async('http://api.uqxdev.com/api/discussions/dates/' + Course.currentCourse + '/').then(function (data) {
                    var formattedNormalData = [
                        { name: 'Posts', data: [] },
                        { name: 'Comments', data: [] }
                    ];
                    var formattedAggregateData = [
                        { name: 'Aggregate Posts', data: [] },
                        { name: 'Aggregate Comments', data: [] }
                    ];

                    if ('thread_datecounts' in data) {
                        for (var key in data['thread_datecounts']) {
                            formattedNormalData[0]['data'].push({ 'date': data['thread_datecounts'][key][0], 'value': data['thread_datecounts'][key][1] });
                        }
                    }

                    if ('comment_datecounts' in data) {
                        for (var key in data['comment_datecounts']) {
                            formattedNormalData[1]['data'].push({ 'date': data['comment_datecounts'][key][0], 'value': data['comment_datecounts'][key][1] });
                        }
                    }

                    if ('thread_datecountsaggregate' in data) {
                        for (var key in data['thread_datecountsaggregate']) {
                            formattedAggregateData[0]['data'].push({ 'date': data['thread_datecountsaggregate'][key][0], 'value': data['thread_datecountsaggregate'][key][1] });
                        }
                    }

                    if ('comment_datecountsaggregate' in data) {
                        for (var key in data['comment_datecountsaggregate']) {
                            formattedAggregateData[1]['data'].push({ 'date': data['comment_datecountsaggregate'][key][0], 'value': data['comment_datecountsaggregate'][key][1] });
                        }
                    }

                    $scope.normalData = formattedNormalData;
                    $scope.aggregateData = formattedAggregateData;
                });
            }
		}


    }

	$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);
