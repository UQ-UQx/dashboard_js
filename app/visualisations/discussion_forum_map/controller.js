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
		$scope.auth = AuthService;

        $scope.$parent.state = 'loading';

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
                refresh = '?refreshcache=true';
            }

            if ($scope.auth.isAuthenticated()) {
				RequestService.async('/discussions/countries/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    if(data['post_total']+"" == '0') {
                        $scope.$parent.state = "notavailable";
                    } else {
                        $scope.populationData = [];
                        $scope.populationEnrolData = [];
                        $scope.postColour = '23, 148, 68';
                        $scope.postEnrolColour = '255, 127, 127';

                        if ('country_post' in data) {
                            for (var key in data['country_post']) {
                                $scope.populationData.push({ country: data['country_post'][key][0], value: data['country_post'][key][1], percentage: data['country_post'][key][2] })
                            }

                            for (var key in data['country_post_enrol']) {
                                $scope.populationEnrolData.push({ country: data['country_post_enrol'][key][0], value: data['country_post_enrol'][key][1], percentage: data['country_post_enrol'][key][3]})
                            }
                        }
                        $scope.$parent.state = 'running';
                    }
				});
			}

        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);