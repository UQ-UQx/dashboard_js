'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_coursestructure_Ctrl', ['$scope', 'RequestService', 'Course', 'createDialog', function ($scope, RequestService, Course, createDialog) {
		$scope.course = Course;

		$scope.formatData = function() {
			if ($scope.auth.isAuthenticated()) {
				RequestService.async('http://api.uqxdev.com/api/meta/structure/' + $scope.course.currentCourse + '/').then(function(data) {
					var coursecontent = data;

                    $scope.coursecontent = coursecontent;

                    $scope.launchStructureModal = function(data) {
                        var attrs = '';
                        for(var attr in data) {
                            attrs += '<dt>'+attr+'</dt><dd>'+data[attr]+'</dd>';
                        }
			            createDialog({
				            id: 'loginDialog',
				            template: '<dl>'+attrs+'</dl>',
                            title: data['display_name'],
                            footerTemplate: '<div></div>',
                            backdrop: true,
                            css: {
                                top: '100px',
                                margin: '0 auto'
                            }
                        });
                    };
				});
			}
		};

		$scope.$watch('course.currentCourse', $scope.formatData());
	}]);