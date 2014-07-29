'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Report_enrolments_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', 'COUNTRY', function ($scope, RequestService, Course, AuthService, COUNTRY) {
		$scope.auth = AuthService;
        $scope.$parent.state = "loading";

        $scope.colourString = '23, 60, 68';

        console.log("REPORT STARTED");

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

            var twodtoname = {};
			for(var country in COUNTRY) {
				twodtoname[COUNTRY[country]['alpha-2']] = COUNTRY[country]['name'];
			}

			if ($scope.auth.isAuthenticated()) {

                //$scope.$parent.state = "running";

                console.log("REPORT LOADING");

                //Enrolment Data
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

                //Enrolment Map
                RequestService.async('http://api.uqxdev.com/api/students/countries/' + Course.currentCourse + '/').then(function(data) {
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
                    console.log("ALL DONE");
                });

			}
        }

		$scope.$watch('auth.isAuthenticated()', $scope.loadData, true);
	}]);