'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('Visualisation_discussion_forum_data_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', function ($scope, RequestService, Course, AuthService) {
	/*$scope.newRegData = [
					['United States', 23.8, ' 3299'],
					['India', 10.6, ' 1472'],
					['Australia', 5.2, ' 715'],
					['United Kingdom', 3.9, ' 540'],
					['Canada', 3.7, ' 519'],
					['Spain', 3.3, ' 451'],
					['Brazil', 2.8, ' 390'],
					['Germany', 2.7, ' 378'],
					['Poland', 2.1, ' 286'],
					['Mexico', 2.0, ' 272'],
					['Egypt', 1.9, ' 257'],
					['Colombia', 1.6, ' 222'],
					['France', 1.4, ' 192'],
					['Pakistan', 1.3, ' 186'],
					['Russian Federation', 1.3, ' 185'],
					['Greece', 1.3, ' 179'],
					['Italy', 1.2, ' 170'],
					['Netherlands', 1.1, ' 151'],
					['Portugal', 1.1, ' 146'],
					['China', 1.0, ' 145']];
 
	$scope.normalData = []; */
	//$scope.aggregateData = [];
	$scope.course = Course;
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



    $scope.sectionChanged = function(discussion_id) {
        $('div.subsection').css({'display':'none'});
        $('div#section_'+discussion_id).css({'display':'block'});
        $('div#section_main').css({'display':'none'});
        $('html,body').scrollTop(0);
    }

    $scope.sectionMain = function() {
        $('div.subsection').css({'display':'none'});
        $('div#section_main').css({'display':'block'});
        $('html,body').scrollTop(0);
    }

    $scope.loadData = function() {

        var refresh = '';

        if($scope.refresh) {
            refresh = '?refreshcache=true';
        }

        if ($scope.auth.isAuthenticated()) {

            if(Course.currentCourse == 'allcourses') {
                $scope.$parent.state = "notavailable";
            } else {

                RequestService.async('/discussions/dates/' + Course.currentCourse + '/'+refresh).then(function (data) {
                    var formattedNormalData = [
                        { name: 'Posts', data: [] },
                        { name: 'Comments', data: [] }
                    ];
                    var formattedAggregateData = [
                        { name: 'Aggregate Posts', data: [] },
                        { name: 'Aggregate Comments', data: [] }
                    ];

                    if ('thread_datecounts' in data) {
                        for (var key in data['thread_datecounts']) {
                            formattedNormalData[0]['data'].push({ 'date': data['thread_datecounts'][key][0], 'value': data['thread_datecounts'][key][1] });
                        }
                    }

                    if ('comment_datecounts' in data) {
                        for (var key in data['comment_datecounts']) {
                            formattedNormalData[1]['data'].push({ 'date': data['comment_datecounts'][key][0], 'value': data['comment_datecounts'][key][1] });
                        }
                    }

                    if ('thread_datecountsaggregate' in data) {
                        for (var key in data['thread_datecountsaggregate']) {
                            formattedAggregateData[0]['data'].push({ 'date': data['thread_datecountsaggregate'][key][0], 'value': data['thread_datecountsaggregate'][key][1] });
                        }
                    }

                    if ('comment_datecountsaggregate' in data) {
                        for (var key in data['comment_datecountsaggregate']) {
                            formattedAggregateData[1]['data'].push({ 'date': data['comment_datecountsaggregate'][key][0], 'value': data['comment_datecountsaggregate'][key][1] });
                        }
                    }



                    $scope.normalData = formattedNormalData;
                    $scope.aggregateData = formattedAggregateData;

                    $scope.$parent.state = "running";
                });

                $scope.topNumber = 10;

                RequestService.async('/discussions/top/' + Course.currentCourse + '/').then(function (data) {
                    $scope.topData = data[Course.currentCourse];
                    console.log($scope.topData);
                });

                RequestService.async('/discussions/popular/' + Course.currentCourse + '/').then(function (data) {
                    $scope.popularData = data[Course.currentCourse];
                    console.log($scope.popularData);
                });

                RequestService.async('/discussions/category/' + Course.currentCourse + '/').then(function (data) {
                    $scope.categoryData = data.categories;


                    console.log("@@@");

                    // Add category details here
                    for ( var i = 0; i < $scope.categoryData.length; i++ ) {
                        var discussion_id = $scope.categoryData[i]['discussion_id'];
                        var categoryDetails = data[discussion_id];

                        // Posts
                        var formattedData = [
                            { name: 'Thread', data: []},
                            { name: 'Comment', data: []},
                            { name: 'Comment2', data: []}
                        ];

                        if ('thread_datecount' in categoryDetails) {
                            for (var key in categoryDetails['thread_datecount']) {
                                formattedData[0]['data'].push({'date': categoryDetails['thread_datecount'][key][0], 'value': categoryDetails['thread_datecount'][key][1]});
                            }
                        }
                        if ('comment_datecounts' in categoryDetails) {
                            for (var key in categoryDetails['comment_datecounts']) {
                                formattedData[1]['data'].push({'date': categoryDetails['comment_datecounts'][key][0], 'value': categoryDetails['comment_datecounts'][key][1]});
                            }
                        }
                        if ('ccomment_datecounts' in categoryDetails) {
                            for (var key in categoryDetails['ccomment_datecounts']) {
                                formattedData[2]['data'].push({'date': categoryDetails['ccomment_datecounts'][key][0], 'value': categoryDetails['ccomment_datecounts'][key][1]});
                            }
                        }
                        $scope.categoryData[i]['dateCount'] = formattedData;

                        // Most 20 Popular Threads
                        var popularThreads = {
                            xAxisName: "Popular Threads",
                            xTicks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
                            yAxisName: "Num of Comments",
                            stackNames: ["Comment", "Comment2"],
                            stackData: []
                        }

                        var stackData = [[], []];
                        if ('popular_threads' in  categoryDetails) {
                            for ( var j = 1; j <= categoryDetails['popular_threads'].length; j++ ) {
                                var thread = categoryDetails['popular_threads'][j-1];
                                var desc = "Thread Id: " + thread['thread_id'] + "</br>" + "Body: " + thread['body'];
                                var com = { x: j.toString(), y: thread['comm_num'], comment: desc};
                                var ccom = { x: j.toString(), y: thread['ccomm_num'], comment: desc};
                                stackData[0][j-1]=com;
                                stackData[1][j-1]=ccom;
                            }
                        }

                        popularThreads['stackData'] = stackData;
                        $scope.categoryData[i]['popularThreads'] = popularThreads;

                        // Comment Per Thread
                        var comment_per_thread = []
                        if('zones' in categoryDetails) {
                            for ( var k = 0; k < categoryDetails['zones'].length; k++) {
                                var zone = categoryDetails['zones'][k];
                                comment_per_thread[k] = {label: zone["label"], value: zone["number"]};
                            }
                        }
                        $scope.categoryData[i]['comment_per_thread'] = comment_per_thread;

                        console.log($scope.categoryData[i]);
                    }

                    console.log("$$$");
                    console.log($scope.categoryData);
                });
            }
		}


    }

	$scope.$watch('auth.isAuthenticated()', $scope.loadData());
	}]);
