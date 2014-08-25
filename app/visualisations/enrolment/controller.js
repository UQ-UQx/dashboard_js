'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolment_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
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

        $scope.loadData = function() {

            var refresh = '';

            if($scope.refresh) {
                refresh = '?refreshcache=true';
            }

            if ($scope.auth.isAuthenticated()) {
				RequestService.async('/students/dates/' + Course.currentCourse + '/').then(function(data) {
					RequestService.async('/meta/courseinfo/').then(function(info) {
						for (var key in info) {
							if (info[key]['id'] === Course.currentCourse || Course.currentCourse == 'allcourses') {
								if ('start' in info[key]) {
									$scope.importantDates.push({ 'name': 'Course Start for '+info[key]['display_name'], 'date': info[key]['start'] });
								}

								if ('end' in info[key]) {
									$scope.importantDates.push({ 'name': 'Course End for'+info[key]['display_name'], 'date': info[key]['end'] });
								}
							}
						}

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
	                    $scope.$parent.state = "running";
					});
				});
			}
        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);