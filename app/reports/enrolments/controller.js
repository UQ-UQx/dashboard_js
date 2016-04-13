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
        $scope.largestCertificates = 0;
        $scope.populationData = [];
        $scope.enrolmentData = [];

        $scope.totalenrolments = 0;
        $scope.totalenrolments_per_day = '-';
        $scope.uniques = '...';

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


            //Enrolment for each course

            RequestService.async('/meta/courseinfo/').then(function(data) {
                $scope.courseEnrolment = [];
                //console.log("AAA");
                //console.log(data);
                data.sort(function(a, b){
                    var keyA = a['start'].replace('"', ""),
                    keyB = b['start'].replace('"', "");
                    console.log(keyA);
                    console.log(keyB);
                    // Compare the 2 dates
                    if(keyA < keyB) return -1;
                    if(keyA > keyB) return 1;
                    return 0;
                });
                $scope.totalenrolments = 0;
                Course.setCourseList(data);
                for(var course_index in Course.courseList) {
                    if(Course.courseList[course_index].id != 'allcourses' && Course.courseList[course_index].id != 'learn_101x_1T2015') {
                        var course = {}
                        course['status'] = 'Pending';
                        var startDate = '';
                        var endDate = '';
                        var currentDate = new Date().getTime();
                        if(Course.courseList[course_index]['start']) {
                            startDate = Date.parse(Course.courseList[course_index]['start']);
                        }
                        if(Course.courseList[course_index]['end']) {
                            endDate = Date.parse(Course.courseList[course_index]['end']);
                        }
                        if(startDate != '' && endDate != '') {
                            if(endDate < currentDate) {
                                course['status'] = 'Archived';
                            }
                            if(startDate < currentDate && currentDate < endDate) {
                                course['status'] = 'Running';
                            }
                        } else if(startDate != '') {
                            if(startDate < currentDate) {
                                course['status'] = 'Running';
                            }
                        }
                        course['meta'] = Course.courseList[course_index];
                        course['enrolments'] = course['meta']['enrolments'];//Math.round(Math.random()*100000);
                        if($scope.largestCourse < course['enrolments']) {
                            $scope.largestCourse = course['enrolments'];
                        }
                        $scope.totalenrolments += course['enrolments'];
                        course['perday'] = course['meta']['enrolments_per_day'];//Math.round(Math.random()*100)/10;
                        if($scope.largestPerDay < course['perday']) {
                            $scope.largestPerDay = course['perday'];
                        }
                        course['certificates'] = Course.courseList[course_index]['certificates'];
                        if($scope.largestCertificates < course['certificates']) {
                            $scope.largestCertificates = course['certificates'];
                        }
                        $scope.courseEnrolment.push(course);
                    }
                    //$scope.totalenrolments_per_day = 0;
                    //for(var course in $scope.courseEnrolment) {
                    //    $scope.totalenrolments_per_day += $scope.courseEnrolment[course]['perday'];
                    //}
                    //$scope.totalenrolments_per_day = Math.round($scope.totalenrolments_per_day / $scope.courseEnrolment.length * 100)/100;
                }
                for(var course in $scope.courseEnrolment) {

                    var enrolments = $scope.courseEnrolment[course]['enrolments'];
                    var percentage = Math.log(enrolments) / Math.log($scope.largestCourse);
                    var s_width = Math.round($scope.style_biggest_width*percentage);
                    var s_top = Math.round(($scope.style_biggest_width-s_width)/2);
                    var s_radius = Math.round(s_width/2);

                    $scope.courseEnrolment[course]['style'] = "width:"+s_width+"px; height:"+s_width+"px; left:"+s_top+"px; top:"+s_top+"px; border-radius:"+s_radius+"px;";

                    enrolments = $scope.courseEnrolment[course]['perday'];
                    percentage = Math.log(enrolments) / Math.log($scope.largestPerDay);
                    s_width = Math.round($scope.style_biggest_width*percentage);
                    s_top = Math.round(($scope.style_biggest_width-s_width)/2);
                    s_radius = Math.round(s_width/2);

                    $scope.courseEnrolment[course]['styleperday'] = "width:"+s_width+"px; height:"+s_width+"px; left:"+s_top+"px; top:"+s_top+"px; border-radius:"+s_radius+"px;";

                    enrolments = $scope.courseEnrolment[course]['certificates'];
                    percentage = Math.log(enrolments) / Math.log($scope.largestCertificates);
                    s_width = Math.round($scope.style_biggest_width*percentage);
                    s_top = Math.round(($scope.style_biggest_width-s_width)/2);
                    s_radius = Math.round(s_width/2);
                    if($scope.courseEnrolment[course]['certificates'] == 0) {
                        s_width = 0;
                    }

                    $scope.courseEnrolment[course]['stylepercerts'] = "width:"+s_width+"px; height:"+s_width+"px; left:"+s_top+"px; top:"+s_top+"px; border-radius:"+s_radius+"px; background-color:crimson;";

                }
            });

            //Uniques
            RequestService.async('/meta/uniques/').then(function(data) {
                $scope.uniques = data['uniques'];
            });

            //Total Enrolments Per Day
            RequestService.async('/meta/enrolcount/').then(function(data) {
                console.log("LOADED ENROL COUNT");
                console.log(data);
                $scope.totalenrolments_per_day = Math.round(parseInt(data['last_month'])/30);
            });

			//Progress and Certificates
			RequestService.async('/meta/courseprofile/').then(function(data) {
				console.log('courseprofile');
				console.log(data);
				var progress = {}
				progress['registered'] = 0;
				progress['viewed'] = 0;
				progress['explored'] = 0;
				progress['certified'] = 0;
				//console.log('progress', progress);
				for(var course_id in data) {
					//console.log(course_id);
					if(course_id != 'allcourses' && course_id != 'learn_101x_1T2015' && data[course_id]['status'] != 'unavailable') {
						//console.log(data[course_id]['nregistered_students']);
						progress['registered'] += data[course_id]['nregistered_students'];
						//console.log(progress['registered']);
						progress['viewed'] += data[course_id]['nviewed_students'];
						progress['explored'] += data[course_id]['nexplored_students'];
						progress['certified'] += data[course_id]['ncertified_students'];
					}
				}
				console.log('after', progress);
				var progress2 = {}
				progress2['Only Registered'] = progress['registered'] - progress['viewed'];
				progress2['Only Viewed'] = progress['viewed'] - progress['explored'];
				progress2['Only Explored'] = progress['explored'] - progress['certified'];
				progress2['Certified'] = progress['certified'];
				console.log('progress2', progress2);
				$scope.progress = $scope.formatPieData(progress2);				
			});


            //Countries
            RequestService.async('/students/countries/').then(function(data) {
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
                $scope.$parent.state = "running";
            });

            //Meta-data
            RequestService.async('/students/ages/'+refresh).then(function(data) {
                $scope.ageData = $scope.formatPieData(data);
            });

            RequestService.async('/students/fullages/' + Course.currentCourse + '/'+refresh).then(function(data) {
                $scope.fullAgeData = $scope.formatBarData(data, true);
                $scope.comment = [];
                $scope.comment.push(['Median', getMedian($scope.fullAgeData)]);
                $scope.comment.push(['Average', getAverage($scope.fullAgeData)]);
            });

            RequestService.async('/students/genders/'+refresh).then(function(data) {
                $scope.genderData = $scope.formatPieData(data);
            });

            RequestService.async('/students/educations/'+refresh).then(function(data) {
                $scope.educationData = $scope.formatPieData(data);
            });

            RequestService.async('/students/modes/'+refresh).then(function(data) {
                delete data['total'];
                //data['audit/honor'] = data['audit'] + data['honor'];
                //delete data['audit'];
                //delete data['honor'];
                console.log('modes');
                console.log(data);
                $scope.enrolTypeData = $scope.formatPieData(data);
                console.log($scope.enrolTypeData);
            });

        }

        $scope.loadData();

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