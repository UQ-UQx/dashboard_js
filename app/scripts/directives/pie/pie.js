'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */

angular.module('charts', [])
    .directive('visPie', function() {
        return {
            restrict: 'EA',
            scope: {
                data: '=data'
            },
            templateUrl: 'scripts/directives/pie/pie.html',
            link: function(scope) {
            	var w = 400;
				var h = 400;
				var r = h/2;
				var color = d3.scale.category20c();

				var vis = d3.select('#chart').append("svg:svg").data([scope.data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
				var arc = d3.svg.arc().outerRadius(r);
				var pie = d3.layout.pie().value(function(d){return d.value;
                                            });
				var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
				arcs.append("svg:path").attr("fill", function(d, i) {
    				return color(i);}).attr("d", arc);
					arcs.append("svg:text").attr("transform", function(d) {
						d.innerRadius = 0;
						d.outerRadius = r;
    					return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    						return scope.data[i].label;
    					});
            }
        };
    });