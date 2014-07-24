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
            console.log("SETTIG COURSE LIST"+courseList);
            courseList.splice(0, 0, {'icon':'fa-dashboard', 'id':'allcourses', 'name':'All Courses List'});
            console.log(courseList);
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
            console.log("GETTING SHORT NAME FOR");
			for (var key in this.courseList) {
				if (this.courseList[key].id === this.currentCourse) {
					return this.courseList[key].shortName;
				}
			}

			return '';
		};

		this.getCourseIds = function() {
            console.log("GETTING ID");
			var courseIds = [];

			for (var key in this.courseList) {
				courseIds.push(this.courseList[key].id);
			}

			return courseIds;
		};

		this.getCourseNameFromId = function(courseId) {
            console.log("GETTING NAME");
			for (var key in this.courseList) {
				if (this.courseList[key].id === courseId) {
					return this.courseList[key].name;
				}
			}

			return null;
		};

		this.getCourseIconFromId = function(courseId) {
            console.log("GETTING ICON");
			for (var key in this.courseIcon) {
				if (this.courseList[key].id === courseId) {
					return this.courseList[key].name;
				}
			}

			return null;		
		};

		return this;
	});
