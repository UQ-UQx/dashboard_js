'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */

app.directive('visPie', function ($window) {
	return {
		restrict: 'EA',

		scope: {
			data: '=data',
			width: '=width',
			height: '=height',
			option: '=?'
		},

		templateUrl: 'scripts/directives/pie/pie.html',

		controller: function($scope) {
			$scope.option = $scope.option || false;
		},

		link: function (scope, element) {

            d3.selection.prototype.moveToFront = function() {
                return this.each(function(){
                    this.parentNode.appendChild(this);
                });
            };

			scope.$watch('data', function(data) {

                var drawChart = function() {

                    var thewidth = scope.width;
                    if (!thewidth) {

                        thewidth = element.parent().width();
                        if(thewidth < 0) {
                            thewidth = 100;
                        }
                        console.log(thewidth);
                    }

                    if ((data !== undefined) && (data !== null) && (data !== [])) {
                        var pie = d3.layout.pie()
                            .sort(null)
                            .value(function (d) {
                                return d.value;
                            });

                        var margin = { top: 20, right: 150, bottom: 20, left: 20 };
                        var colors = d3.scale.category20();
                        var tipOn = true;

                        var width = thewidth - margin.right - margin.left,
                            height = scope.height - margin.top - margin.bottom;

                        var radius = d3.min([width, height]) / 2;

                        var arc = d3.svg.arc()
                            .outerRadius(radius)
                            .innerRadius(0);

                        $(element.find('.pie-chart')[0]).html("");

                        var svg = d3.select(element.find('.pie-chart')[0])
                            .attr('width', thewidth)
                            .attr('height', scope.height)
                            .append('g')
                            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                        var tip = d3.tip()
                            .attr('class', 'd3-tip')
                            .html(function (d) {
                                var tipStr = '';
                                if (d.data.comment) {
                                    tipStr = d.data.comment;
                                }
                                else {
                                    tipStr = '<strong>' + d.data.label + ': </strong> ' + d.value + ' (' + (d.value / sum * 100).toFixed(1) + '%)';
                                }
                                return tipStr;
                            })
                            .offset(function (d) {
                                return [-10, 0];
                            });

                        var texton = function (d) {
                            var textElemnt = d3.select(this).node();
                            tip.show(d, textElemnt);
                        };

                        var textoff = function (d) {
                            tip.hide();
                        };

                        var contrastingColor = function (d3Color) {
                            var yiq = ((d3Color.r * 299) + (d3Color.g * 587) + (d3Color.b * 114)) / 1000;
                            return (yiq >= 128) ? '#111111' : '#fafafa';
                        }

                        var arcs = svg.selectAll('g.arc')
                            .data(pie(data))
                            .enter()
                            .append('g')
                            .attr('class', 'arc')
                            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

                        var sum = d3.sum(data, function (d) {
                            return d.value;
                        });

                        arcs.call(tip);

                        arcs.append('path')
                            .attr('fill', function (d, i) {
                                return colors(i);
                            })
                            .attr('d', arc)
                            .on('mouseover', function (d, i) {
                                //d3.select(this).remove();
                                //var savedSlice = d3.select(this);
                                //savedSlice.remove();
                                d3.select(this).style('stroke-width', 6);
                                d3.select(this).style('stroke', d3.rgb(colors(i)).brighter(0.7));
                                d3.select(this.parentNode).select('.arctext').each(texton);
                                d3.select(this.parentNode).moveToFront();

                            })
                            .on('mouseout', function (d) {
                                d3.select(this).style('stroke-width', 0);
                                if (tipOn) {
                                    tip.hide();
                                }
                            });

                        arcs.append('text')
                            .attr('transform', function (d, i) {
                                var centroid = arc.centroid(d);
                                var xc = centroid[0] * 1.5;
                                var yc = centroid[1] * 1.5 + 5;
                                return 'translate(' + xc + ',' + yc + ')';
                            })
                            .attr('class', 'arctext')
                            .attr('text-anchor', 'middle')
                            .text(function (d) {
                                // Only show text when the arc is large enough
                                if ((d.endAngle - d.startAngle) > 0.2) {
                                    return d.value;
                                }
                                else {
                                    return ' ';
                                }
                            })
                            .attr('fill', function (d, i) {
                                var gColor = d3.rgb(colors(i));
                                return contrastingColor(gColor);
                            })
                            .on('mouseover', texton)
                            .on('mouseout', textoff);

                        d3.selectAll('.arctext').call(tip);

                        // Add legend
                        var legend = svg.selectAll('g.legend')
                            .data(data)
                            .enter()
                            .append('g')
                            .attr('class', 'legends')
                            .attr('transform', function (d, i) {
                                return 'translate(' + ( width + margin.left ) + ',' + i * 20 + ')';
                            })
                            .style('fill', function (d, i) {
                                return colors(i);
                            });

                        legend.append('rect')
                            .attr('width', 18)
                            .attr('height', 18);

                        legend.append('text')
                            .attr('x', 20)
                            .attr('y', 9)
                            .attr('dy', '.35em')
                            .style('text-anchor', 'start')
                            .text(function (d) {
                                return d.label;
                            });
                    }
                }

                //drawChart();

                scope.resize = function() {
					d3.select(element.find('.tip')[0]).selectAll().remove();
					d3.select(element.find('.pie-chart')[0]).selectAll('g').remove();
					drawChart();
                }

				window.addEventListener('resize', function(event){
                    clearTimeout(scope.resizetimeout);
                    scope.resizetimeout = setTimeout(scope.resize,100);
				});

                setTimeout(scope.resize,500);

			});
		}
	};
});