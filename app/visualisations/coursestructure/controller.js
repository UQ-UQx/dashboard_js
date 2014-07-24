'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_coursestructure_Ctrl', ['$scope', 'RequestService', 'Course', 'AuthService', 'createDialog', function ($scope, RequestService, Course, AuthService, createDialog) {
		$scope.auth = AuthService;
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

            if ($scope.auth.isAuthenticated()) {

                if(Course.currentCourse == 'allcourses') {
                    $scope.$parent.state = "notavailable";
                } else {
                    RequestService.async('http://api.uqxdev.com/api/meta/structure/' + Course.currentCourse + '/').then(function (data) {
                        var coursecontent = data;

                        $scope.coursecontent = coursecontent;

                        $scope.launchStructureModal = function (data) {
                            var attrs = '';
                            for (var attr in data) {
                                if (attr != 'children') {
                                    attrs += '<dt>' + attr + '</dt><dd>' + data[attr] + '</dd>';
                                }
                            }

                            createDialog({
                                id: 'loginDialog',
                                template: '<dl>' + attrs + '</dl>',
                                title: data['display_name'],
                                footerTemplate: '<div></div>',
                                backdrop: true,
                                css: {
                                    top: '100px',
                                    margin: '0 auto'
                                }
                            });
                        };

                        $scope.$parent.state = "running";

                    });
                }
			}

        }

		$scope.$watch('auth.isAuthenticated()',$scope.loadData());
	}]);