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

        $scope.style_biggest_width = 138;


        $scope.courseEnrolment = [];
        $scope.largestCourse = 0;
        $scope.largestPerDay = 0;
        $scope.populationData = [];
        $scope.enrolmentData = [];

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

                //Enrolment for each course

                RequestService.async('http://api.uqxdev.com/api/meta/courses/').then(function(data) {
                    $scope.courseEnrolment = [];
                    Course.setCourseList(data);
                    for(var course_index in Course.courseList) {
                        if(Course.courseList[course_index].id != 'allcourses') {
                            var course = {}
                            course['meta'] = Course.courseList[course_index];
                            course['enrolments'] = Math.round(Math.random()*100000);
                            if($scope.largestCourse < course['enrolments']) {
                                $scope.largestCourse = course['enrolments'];
                            }
                            course['perday'] = Math.round(Math.random()*100)/10;
                            if($scope.largestPerDay < course['perday']) {
                                $scope.largestPerDay = course['perday'];
                            }
                            course['status'] = 'Running';
                            $scope.courseEnrolment.push(course);
                        }
                    }
                    for(var course in $scope.courseEnrolment) {

                        var enrolments = $scope.courseEnrolment[course]['enrolments'];
                        var percentage = enrolments / $scope.largestCourse;
                        var s_width = Math.round($scope.style_biggest_width*percentage);
                        var s_top = Math.round(($scope.style_biggest_width-s_width)/2);
                        var s_radius = Math.round(s_width/2);

                        $scope.courseEnrolment[course]['style'] = "width:"+s_width+"px; height:"+s_width+"px; left:"+s_top+"px; top:"+s_top+"px; border-radius:"+s_radius+"px;";

                        enrolments = $scope.courseEnrolment[course]['perday'];
                        percentage = enrolments / $scope.largestPerDay;
                        s_width = Math.round($scope.style_biggest_width*percentage);
                        s_top = Math.round(($scope.style_biggest_width-s_width)/2);
                        s_radius = Math.round(s_width/2);

                        $scope.courseEnrolment[course]['styleperday'] = "width:"+s_width+"px; height:"+s_width+"px; left:"+s_top+"px; top:"+s_top+"px; border-radius:"+s_radius+"px;";

                        console.log($scope.courseEnrolment[course]);
                    }
                });

                //Countries
                RequestService.async('http://api.uqxdev.com/api/students/countries/').then(function(data) {
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
                    $scope.$parent.state = "running";
                });

                //Meta-data
                RequestService.async('http://api.uqxdev.com/api/students/ages/'+refresh).then(function(data) {
                    $scope.ageData = $scope.formatPieData(data);
                });

                RequestService.async('http://api.uqxdev.com/api/students/genders/'+refresh).then(function(data) {
                    $scope.genderData = $scope.formatPieData(data);
                });

                RequestService.async('http://api.uqxdev.com/api/students/educations/'+refresh).then(function(data) {
                    $scope.educationData = $scope.formatPieData(data);
                });

                RequestService.async('http://api.uqxdev.com/api/students/modes/'+refresh).then(function(data) {
                    $scope.enrolTypeData = $scope.formatPieData(data);
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
	}]);