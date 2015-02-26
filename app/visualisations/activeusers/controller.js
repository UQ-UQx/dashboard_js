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
                        console.log($scope.pc.enrolled);
                    });

                    $scope.$parent.state = "running";
				});
			}
        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData, true);
	}]);