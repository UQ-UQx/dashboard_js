'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_studentactivity_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
		$scope.auth = AuthService;
        $scope.$parent.state = "loading";

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
                $scope.$parent.state = "loading";
                console.log("LOADING");
				RequestService.async('http://localhost:8000/api/students/student_activity/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    console.log("FINISHED");
                    $scope.areaData = data;
                    $scope.$parent.state = "running";
				});
			}
        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData, true);
	}]);