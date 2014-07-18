'use strict';

/**
 * @ngdoc service
 * @name dashboardJsApp.Course
 * @description
 * # Course
 * Service in the dashboardJsApp.
 */
angular.module('dashboardJsApp')
	.service('Course', function Course() {
		this.currentCourse = '';
		this.courseList = [];

		this.getCourseIds = function() {
			var courseIds = [];

			for (var key in this.courseList) {
				courseIds.push(this.courseList[key].id);
			}

			return courseIds;
		};

		this.getCourseNameFromId = function(courseId) {
			for (var key in this.courseList) {
				if (this.courseList[key].id === courseId) {
					return this.courseList[key].name;
				}
			}

			return null;
		};

		this.getCourseIconFromId = function(courseId) {
			for (var key in this.courseIcon) {
				if (this.courseList[key].id === courseId) {
					return this.courseList[key].name;
				}
			}

			return null;		
		};

		return this;
	});
