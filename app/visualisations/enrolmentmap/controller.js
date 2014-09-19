'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolmentmap_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', 'COUNTRY', function ($scope, RequestService, Course, AuthService, COUNTRY) {
		$scope.enrolmentData = [];
		$scope.populationData = [];
		$scope.auth = AuthService;
		$scope.colourString = '23, 60, 68';

        $scope.total_countries = 0;

        $scope.APIBASE = APIBASE;

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

			var twodtoname = {};
			for(var country in COUNTRY) {
				twodtoname[COUNTRY[country]['alpha-2']] = COUNTRY[country]['name'];
			}

            if ($scope.auth.isAuthenticated()) {
                RequestService.async('/students/countries/' + Course.currentCourse + '/'+refresh).then(function(data) {
                    $scope.populationData = [];
                    $scope.enrolmentData = [];
                    var tmpEnrolmentData = [];
                    for(var country in data) {
                        if(country != 'null') {
                            var roundedPercentage = Math.round(data[country]['percentage']*100)/100;
                            var popObject = {'country': country, 'value': data[country]['count'], 'percentage': roundedPercentage};
                            $scope.populationData.push(popObject);
                            var enrolObject = [twodtoname[country], roundedPercentage, data[country]['count']];
                            tmpEnrolmentData.push(enrolObject);
                        }
                    }
                    $scope.total_countries = tmpEnrolmentData.length;
                    function percentage_compare(a,b) {
                      if (a[1] > b[1])
                         return -1;
                      if (a[1] < b[1])
                        return 1;
                      return 0;
                    }
                    tmpEnrolmentData.sort(percentage_compare);
                    var i = 0;
                    for(country in tmpEnrolmentData) {
                        if(tmpEnrolmentData[country][1] < 1 || i > 20) {
                            break;
                        }
                        i++;
                        $scope.enrolmentData.push(tmpEnrolmentData[country]);
                    }
                });
                $scope.$parent.state = "running";
            }

		}

		$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);
