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
            if(!courseList['error']) {
                courseList.splice(0, 0, {'icon': 'fa-dashboard', 'id': 'allcourses', 'name': 'All Courses List'});
                for (var i in courseList) {
                    var shortName = courseList[i].name.split(" ");
                    shortName.pop();
                    shortName = shortName.join(" ");
                    shortName = shortName.charAt(0).toUpperCase() + shortName.slice(1);
                    courseList[i].shortName = shortName;
                }
            } else {
                alert(courseList['error']);
                return null;
            }
            
            console.log(courseList);
			this.courseList = courseList.sort(compareCourse);
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


function compareCourse(course1,course2) {
	// 'All Courses List' is always the first one
	if(course1.name == "All Courses List") 
		return -1;	
	if(course2.name == "All Courses List") 
		return 1;
	
	// Rule1: compare shortName
	if(course1.shortName < course2.shortName)
		return -1;
	if(course1.shortName > course2.shortName)
		return 1;
	
	// Rule2: compare yeasr
	if(course1.year < course2.year)
		return -1;
	if(course1.year > course2.year)
		return 1;
	
	// Rule3: compare Term
	if(course1.term < course2.term)
		return -1;
	if(course1.term > course2.term)
		return 1;
	
	return 0;
}
