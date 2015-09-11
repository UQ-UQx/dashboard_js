'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_enrolmentmetadata_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
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

		$scope.loadData = function() {

			var refresh = '';

			if($scope.refresh) {
				refresh = '?refreshcache=true';
			}

			if ($scope.auth.isAuthenticated()) {
				console.log(refresh);
				RequestService.async('/students/ages/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.ageData = $scope.formatBarData(data);
				});

                RequestService.async('/students/fullages/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.fullAgeData = $scope.formatBarData(data, true);
                    $scope.comment = [];
                    $scope.comment.push(['Median', getMedian($scope.fullAgeData)]);
                    $scope.comment.push(['Average', getAverage($scope.fullAgeData)]);
				});

				RequestService.async('/students/genders/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.genderData = $scope.formatPieData(data);
                    console.log($scope.genderData);
				});

				RequestService.async('/students/educations/' + Course.currentCourse + '/'+refresh).then(function(data) {
					$scope.educationData = $scope.formatBarData(data);
				});

				RequestService.async('/students/modes/' + Course.currentCourse + '/'+refresh).then(function(data) {
					delete data['total'];
					$scope.enrolTypeData = $scope.formatPieData(data);
				});
				$scope.$parent.state = "running";
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
	}]);

function getMedian(data) {
    console.log('data', data);

    var sequence = [];

    for(var i=0; i<data.length; i++) {
        var num = data[i][0];
        for(var j=0; j<data[i][2]; j++) {
            sequence.push(num);
        }
    }
    //console.log('sequence', sequence);

    if(sequence.length == 0) {
        return null;
    }

    if(sequence.length % 2 == 0) {
        return Math.round((parseInt(sequence[sequence.length/2]) + parseInt(sequence[sequence.length/2-1]))/2);

    }
    else {
        return parseInt(sequence[(sequence.length-1)/2]);
    }
}

function getAverage(data) {

    var average = 0;
    for(var i=0; i<data.length; i++) {
        average += data[i][0] * data[i][1];
        //console.log('average', average);
    }

    return Math.round(average/100);
}