'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_activeusers_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
		$scope.auth = AuthService;
        $scope.$parent.state = "loading";

        $scope.APIBASE = APIBASE;

        $scope.refresh = false;
        $scope.importantDates = [];

        $scope.refreshData = function() {
            $scope.$parent.state = "loading";
            $scope.refresh = true;
            $scope.loadData();
            $scope.refresh = false;
        }

        $scope.loadData = function () {

            var refresh = '';

            if($scope.refresh) {
                refresh = '?refreshcache=true';
            }

			if ($scope.auth.isAuthenticated()) {
				RequestService.async('/students/active/' + Course.currentCourse + '/'+refresh).then(function(data) {

                    RequestService.async('/meta/courseinfo/').then(function(info) {
                        for (var key in info) {
                            if (info[key]['id'] === Course.currentCourse || Course.currentCourse == 'allcourses') {
                                if ('start' in info[key]) {
                                    $scope.importantDates.push({ 'name': 'Course Start for ' + info[key]['display_name'], 'date': info[key]['start'] });
                                }

                                if ('end' in info[key]) {
                                    $scope.importantDates.push({ 'name': 'Course End for' + info[key]['display_name'], 'date': info[key]['end'] });
                                }
                            }
                        }

                        var formattedDailyData = [{ name: 'Daily', data: [] }];
                        var formattedWeeklyData = [{ name: 'Weekly', data: [] }];

                        for (var day in data['days']) {
                            formattedDailyData[0].data.push({ date: day, value: data['days'][day] });
                        }

                        for (var week in data['weeks']) {
                            formattedWeeklyData[0].data.push({ date: week, value: data['weeks'][week] });
                        }

                        $scope.dailyData = formattedDailyData;
                        $scope.weeklyData = formattedWeeklyData;
                        $scope.pc = {}
                        RequestService.async('/students/personcourse/' + Course.currentCourse + '/'+refresh).then(function(pcdata) {
                            $scope.pc.enrolled = 0;
                            $scope.pc.viewed = 0;
                            $scope.pc.explored = 0;
                            $scope.pc.certified = 0;
                            $scope.pc.onechapter = 0;
                            $scope.pc.threechapters = 0;

                            $scope.pc.viewed_stupercent = 0;
                            $scope.pc.explored_stupercent = 0;
                            $scope.pc.certified_stupercent = 0;
                            $scope.pc.onechapter_stupercent = 0;
                            $scope.pc.threechapters_stupercent = 0;

                            $scope.pc.threechapters_lastcol = 0;
                            $scope.pc.explored_lastcol = 0;
                            $scope.pc.certified_lastcol = 0;

                            for(var person in pcdata) {
                                $scope.pc.enrolled += 1;
                                if(pcdata[person].certified) {
                                    $scope.pc.certified += 1;
                                }
                                if(pcdata[person].viewed) {
                                    $scope.pc.viewed += 1;
                                }
                                if(pcdata[person].explored) {
                                    $scope.pc.explored += 1;
                                }
                                if(pcdata[person].nchapters > 2) {
                                    $scope.pc.threechapters += 1;
                                }
                            }
                            $scope.pc.viewed_stupercent = Math.round($scope.pc.viewed/$scope.pc.enrolled*100)+"%";
                            $scope.pc.explored_stupercent = Math.round($scope.pc.explored/$scope.pc.enrolled*100)+"%";
                            $scope.pc.certified_stupercent = Math.round($scope.pc.certified/$scope.pc.enrolled*100)+"%";
                            $scope.pc.onechapter_stupercent = Math.round($scope.pc.onechapter/$scope.pc.enrolled*100)+"%";
                            $scope.pc.threechapters_stupercent = Math.round($scope.pc.threechapters/$scope.pc.enrolled*100)+"%";

                            $scope.pc.threechapters_lastcol = Math.round($scope.pc.threechapters/$scope.pc.viewed*100)+"%";
                            $scope.pc.explored_lastcol = Math.round($scope.pc.explored/$scope.pc.threechapters*100)+"%";
                            $scope.pc.certified_lastcol = Math.round($scope.pc.certified/$scope.pc.explored*100)+"%";

                            console.log($scope.pc.enrolled);
                        });

                        $scope.$parent.state = "running";
                    });
				});
			}
        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData, true);
	}]);