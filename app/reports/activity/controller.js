'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Report_activity_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
		$scope.auth = AuthService;
        $scope.$parent.state = "loading";

        console.log("ACTIVE STARTED");

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

                $scope.$parent.state = "running";

//				RequestService.async('http://api.uqxdev.com/api/students/active/' + Course.currentCourse + '/'+refresh).then(function(data) {
//					var formattedDailyData = [{ name: 'Daily', data: [] }];
//					var formattedWeeklyData = [{ name: 'Weekly', data: [] }];
//
//					for (var day in data['days']) {
//						formattedDailyData[0].data.push({ date: day, value: data['days'][day] });
//					}
//
//					for (var week in data['weeks']) {
//						formattedWeeklyData[0].data.push({ date: week, value: data['weeks'][week] });
//					}
//
//					$scope.dailyData = formattedDailyData;
//					$scope.weeklyData = formattedWeeklyData;
//                    $scope.$parent.state = "running";
//				});
                console.log("ACTIVE LOADING");
			}
        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData, true);
	}]);