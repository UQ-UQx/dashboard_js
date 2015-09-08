'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_course_events_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
        $scope.course = Course;
		$scope.auth = AuthService;
		$scope.$parent.state = "loading";

        //$scope.colourString = '81, 84, 172';

        $scope.APIBASE = APIBASE;

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
				refresh = '&refreshcache=true';
			}

			if ($scope.auth.isAuthenticated()) {

                if (Course.currentCourse == 'allcourses') {
                    $scope.$parent.state = "notavailable";
                }
                else {

                    $scope.$parent.state = "loading";
                    RequestService.async('/meta/courseevents/' + Course.currentCourse + '/' + refresh).then(function (data) {
                        //console.log('Data API', data);

                        var layerData = [];
                        for (var i = 0; i < data.date_list.length; i++) {
                            layerData[i] = [];
                        }

                        var metaData = {};
                        metaData.eventList = [];
                        for (var i = 0; i < data.happened_events.length; i++) {
                            metaData.eventList.push(data.event_display_names[data.happened_events[i]]);
                        }

                        metaData.dateList = data.date_list;

                        var event_values = data.happened_events_values;

                        for (var i = 0; i < event_values.length; i++) {

                            for (var j = 0; j < event_values[i].length; j++) {
                                if (j == 0) {
                                    layerData[j].push({x: i, y: Number(event_values[i][j]), y0: 0});
                                }
                                else {
                                    var y0 = layerData[j - 1][i].y + layerData[j - 1][i].y0;
                                    layerData[j].push({x: i, y: Number(event_values[i][j]), y0: y0});
                                }
                            }
                        }

                        $scope.layerData = layerData;
                        $scope.metaData = metaData;
                        $scope.$parent.state = "running";

                    });
                }
            }
		}

		$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);
