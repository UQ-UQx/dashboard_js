'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_discussion_forum_map_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {

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
                    $scope.$parent.state = "running";
				});
			}

        }

		$scope.populationData = [{ 'country' : 'AU', 'value': '10', 'percentage': '10'}, { 'country': 'US', 'value': '50', 'percentage': '40'}];
		$scope.colourString1 = '23, 148, 68';
		$scope.colourString2 = '255, 127, 127';
		$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);