'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_grades_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
		$scope.auth = AuthService;

		$scope.$parent.state = "loading";

        $scope.colourString = '23, 60, 68';

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
				RequestService.async('/students/personcourse/' + Course.currentCourse + '/?fields=user_id,certified,final_cc_cname,explored,registered,viewed,grade'+refresh).then(function(data) {
                    var certificateData = {'Yes':0,'No':0};
                    var attemptData = {'Registered':0,'Viewed':0,'Explored':0,'Certified':0};
                    var countries = {};
                    var grades = {'0-10%':0,'10-20%':0,'20-30%':0,'30-40%':0,'40-50%':0,'50-60%':0,'60-70%':0,'70-80%':0,'80-90%':0,'90-100%':0};
                    for(var per in data) {
                        if(data[per]['certified'] == '1') {
                            certificateData['Yes'] += 1;
                            attemptData['Certified'] += 1;
                            if(!countries[data[per]['final_cc_cname']]) {
                                countries[data[per]['final_cc_cname']] = 0;
                            }
                            countries[data[per]['final_cc_cname']] += 1;
                        } else {
                            certificateData['No'] += 1;
                            if(data[per]['explored'] == '1') {
                                attemptData['Certified'] += 1;
                            } else if(data[per]['explored'] == '1') {
                                attemptData['Explored'] += 1;
                            } else if(data[per]['viewed'] == '1') {
                                attemptData['Viewed'] += 1;
                            } else {
                                attemptData['Registered'] += 1;
                            }
                        }
                        var grade = Math.round(100*parseFloat(data[per]['grade']));
                        if(grade > 89) {
                            grades['90-100%'] += 1;
                        } else if (grade > 79) {
                            grades['80-90%'] += 1;
                        } else if (grade > 69) {
                            grades['70-80%'] += 1;
                        } else if (grade > 59) {
                            grades['60-70%'] += 1;
                        } else if (grade > 49) {
                            grades['50-60%'] += 1;
                        } else if (grade > 39) {
                            grades['40-50%'] += 1;
                        } else if (grade > 29) {
                            grades['30-40%'] += 1;
                        } else if (grade > 19) {
                            grades['20-30%'] += 1;
                        } else if (grade > 9) {
                            grades['10-20%'] += 1;
                        } else {
                            grades['0-10%'] += 1;
                        }
                    }
                    $scope.certificateData = $scope.formatBarData(certificateData);
                    $scope.gradeData = $scope.formatBarData(grades,true);
                    console.log("###");
                    console.log($scope.gradeData);
                    $scope.attemptData = $scope.formatPieData(attemptData);
                    $scope.countries = $scope.formatMapData(countries);
                    $scope.$parent.state = "running";
				});
			}
		}

		$scope.$watch('auth.isAuthenticated()', $scope.loadData, true);

		$scope.formatPieData = function(unformattedData) {
			var formattedData = [];

			for (var key in unformattedData) {
				formattedData.push({ label: key, value: unformattedData[key] });
			}

			return formattedData;
		};

		$scope.formatBarData = function(unformattedData,nosort) {
			var formattedData = [];
			var totalDataValue = 0;

			for (var key in unformattedData) {
				totalDataValue += unformattedData[key];
			}

			for (var key in unformattedData) {
				formattedData.push([key, Math.round(((unformattedData[key] / totalDataValue) * 100) * 100) / 100 , unformattedData[key]]);
			}
            if(!nosort) {
                formattedData.sort(function (a, b) {
                    return b[1] - a[1]
                });
            }

			return formattedData;
		};

        $scope.formatMapData = function(unformattedData,nosort) {
			var formattedData = [];
			var totalDataValue = 0;

			for (var key in unformattedData) {
				totalDataValue += unformattedData[key];
			}

            var splitcountries = {};
            for (var key in unformattedData) {
                var each_country = key.split(",");
                for(var cnt in each_country) {
                    if(!splitcountries[each_country[cnt]]) {
                        splitcountries[each_country[cnt]] = 0;
                    }
                    splitcountries[each_country[cnt]] += unformattedData[key];
                }
            }
			for (var cnt in splitcountries) {
                formattedData.push({'country': cnt, 'value': splitcountries[cnt], 'percentage': Math.round(splitcountries[cnt] / totalDataValue * 100)});
			}
            if(!nosort) {
                formattedData.sort(function (a, b) {
                    return b[1] - a[1]
                });
            }
            console.log(formattedData);
			return formattedData;
		};
	}]);