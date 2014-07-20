'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
	.controller('Visualisation_coursestructure_Ctrl', ['$scope', 'RequestService', 'Course', function ($scope, RequestService, Course) {
		$scope.course = Course;

		$scope.formatData = function() {
			if ($scope.auth.isAuthenticated()) {
				RequestService.async('http://api.uqxdev.com/api/meta/structure/' + $scope.course.currentCourse + '/').then(function(data) {
					var coursedata = [];
					var coursecontent = data;

					function render_obj(obj) {
						var output = '<li class="type_'+obj['tag']+'"><a class="popup"><strong>';
						coursedata.push(obj);
						var dataindex = coursedata.length - 1;

						if (obj['display_name']) {
							output += '<em>&lt;' + obj['tag'] + '&gt;</em> ' + obj['display_name'];
						} else {
							output += '<em>&lt;' + obj['tag'] + '&gt;</em> ' + 'Unnamed ' + obj['tag'] + ' element';
						}

						if (obj['url_name']) {
							output += '<span class="hidden">' + obj['url_name'] + '</span>';
						}

						output += '<span class="data" data-index="' + dataindex + '"></span>'
						output += '</strong>';

						if (obj['children'] && obj['children'].length > 0) {
							output += '<ul>';
							for (var child in obj['children']) {
								output += render_obj(obj['children'][child]);
							}
							output += '</ul>';
						}

						output += '</a></li>';

						return output;
					}

					var output = '<ul>'+render_obj(coursecontent)+'</ul>';

					console.log(coursedata);
					console.log(coursedata.length);

					console.log(output);

					$('#raw').html(output);

					$('.popup').click(function () {
						var dataindex = $(this).find('span').data().index;
						var data = coursedata[dataindex];
						$('h4.modal-title').html(data['display_name']);
						var modaloutput = "<dl>";
						for (var attr in data) {
							if (attr != 'children') {
								modaloutput += "<dt>" + attr + "</dt><dd>" + data[attr] + "</dd>";
							}
						}
						modaloutput += "</dl>";
						$('div.modal-body').html(modaloutput);
						$('#data_modal').modal();
					});

					$('#searchbox').keyup(function() {
						var val = $('#searchbox').val().toLowerCase();
						$('#raw li').each(function(i,obj) {
							if($(obj).text().toLowerCase().indexOf(val) != -1) {
								$(obj).css({'display':'block'});
							} else {
								$(obj).css({'display':'none'});
							}
						});
					})
				});
			}
		};

		//$scope.$watch('auth.isAuthenticated()', $scope.formatData());
		$scope.$watch('course.currentCourse', $scope.formatData());
	}]);