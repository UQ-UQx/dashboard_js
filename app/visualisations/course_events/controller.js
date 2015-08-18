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
                $scope.$parent.state = "loading";
                RequestService.async('/meta/courseevents/' + Course.currentCourse + '/' + refresh).then(function(data) {
                    console.log('Data API', data);

                    var layerData = [];
                    for ( var i = 0; i < data.date_list.length; i++) {
                        layerData[i] = [];
                    }

                    var metaData = {};
                    metaData.eventList = [];
                    for(var i = 0; i < data.happened_events.length; i++) {
                        metaData.eventList.push(data.event_display_names[data.happened_events[i]]);
                    }

                    metaData.dateList = data.date_list;

                    //console.log('metaData', metaData);

                    var event_values = data.happened_events_values;

                    for(var i = 0; i < event_values.length; i++) {

                        for(var j = 0; j < event_values[i].length; j++) {
                            if(j == 0) {
                                layerData[j].push({x:i, y: Number(event_values[i][j]), y0: 0});
                            }
                            else {
                                var y0 = layerData[j-1][i].y + layerData[j-1][i].y0;
                                layerData[j].push({x:i, y: Number(event_values[i][j]), y0: y0});
                            }
                        }
                    }
                    //console.log('layerData', layerData);

                    $scope.layerData = layerData;
                    $scope.metaData = metaData;
                    $scope.$parent.state = "running";


                    /*

                    var layerData = [];
                    var metaData = {};
                    metaData.eventList = [];
                    for(var key in data) {
                        metaData.eventList.push(key);

                        if(layerData.length == 0) {
                            var date_list = get_date_list(data[key]);
                            metaData.dateList = date_list;
                            layerData = init_layer(date_list);
                        }

                        for(var i = 0; i < layerData.length; i++) {
                            if(i == 0) {
                                layerData[i].push({x:metaData.eventList.length - 1, y: Number(data[key][i][1]), y0: 0});
                            }
                            else {
                                var l = layerData[i].length;
                                var y0 = layerData[i-1][l].y + layerData[i-1][l].y0;
                                layerData[i].push({x:metaData.eventList.length - 1, y: Number(data[key][i][1]), y0: y0 });
                            }
                        }
                    }

                    console.log('layerData', layerData);

                    $scope.layerData = layerData;
                    $scope.metaData = metaData;
                    console.log('meta', metaData);
                    $scope.$parent.state = "running";
                    */
				});
			}
		}

		$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);

function get_date_list(data)  {
    var date_list = [];
    for (var i = 0; i < data.length; i++) {
        date_list.push(data[i][0]);
    }

    return date_list;
}

function init_date_list(date_list)  {
    var formattedData = [];
    for (var i = 0; i < date_list.length; i++) {
        formattedData.push({name: date_list[i], values:[]});
    }

    return formattedData;
}

function init_layer(date_list)  {
    var layerData = [];
    for (var i = 0; i < date_list.length; i++) {
        layerData.push([]);
    }

    console.log(layerData);

    return layerData;
}