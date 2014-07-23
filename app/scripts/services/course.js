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

		this.setCourseList = function(courseList) {
			for (var i in courseList) {
				var shortName = courseList[i].name.split(" ");
				shortName.pop();
				shortName = shortName.join(" ");
				shortName = shortName.charAt(0).toUpperCase() + shortName.slice(1);
				courseList[i].shortName = shortName;
			}

			this.courseList = courseList;
		};

		this.getCurrentCourseShortName = function() {
			for (var key in this.courseList) {
				if (this.courseList[key].id === this.currentCourse) {
					return this.courseList[key].shortName;
				}
			}

			return '';
		};

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
