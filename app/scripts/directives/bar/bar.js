'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.directive:visLine
 * @description
 * # visLine
 * d3 Line Chart Directive of the dashboardJsApp
 */

app.directive('visBar', function() {
	return {
		restrict: 'EA',
		scope: {
			data: '=data',
			width: '=width',
			height: '=height',
			options: '=?',
            comment: '=?',
		},
		templateUrl: 'scripts/directives/bar/bar.html',
		link: function(scope, element) {
			scope.$watch('data', function() {
				var data = scope.data;
                console.log('data', data);

				if(!data) {
					return
				}

				scope.options = scope.options || false;
                console.log('options', scope.options);

                scope.comment = scope.comment || false;
                console.log('comment', scope.comment);

				var drawChart = function() {

					var thewidth = scope.width;
					if (!thewidth) {
						thewidth = element.parent().width();
						if(thewidth < 0) {
							thewidth = 100;
						}
					}

					var yticks = [];
					var maxPercentage = 0;
					for (var i = 0; i < data.length; i++) {
						yticks.push(data[i][0]);
						if (data[i][1] > maxPercentage) {
							maxPercentage = data[i][1];
						}
					}

					/* default chart options */
					var barFill = '#393b79',
						highlightFill = d3.rgb(barFill).brighter(),
						tipOn = true,
						ceilUnit = 5,
						margin = {top: 50, right: 50, bottom: 20, left: 150},
						minBarHeight = 7;
					/* custom default options */
					if (scope.options !== false) {
						barFill = (scope.options.barFill == null) ? barFill : scope.options.barFill;
						highlightFill = (scope.options.highlightFill == null) ? highlightFill : scope.options.highlightFill;
						tipOn = (scope.options.tipOn == null) ? tipOn : scope.options.tipOn;
						ceilUnit = (scope.options.ceilUnit == null) ? ceilUnit : scope.options.ceilUnit;
						margin = (scope.options.margin == null) ? margin : scope.options.margin;
						minBarHeight = (scope.options.minBarHeight == null) ? minBarHeight : scope.options.minBarHeight;
						margin.left = (scope.options.marginLeft == null) ? margin.left : scope.options.marginLeft;
						margin.right = (scope.options.marginRight == null) ? margin.right : scope.options.marginRight;
						margin.top = (scope.options.marginTop == null) ? margin.top : scope.options.marginTop;
						margin.bottom = (scope.options.marginBottom == null) ? margin.bottom : scope.options.marginBottom;

					}

					maxPercentage = Math.ceil(maxPercentage / ceilUnit) * ceilUnit;
					var width = thewidth - margin.right - margin.left,
						height = scope.height - margin.top - margin.bottom;

					var barHeight = height / (yticks.length * 2 + 1);
					var svgHeight = scope.height;
					/* adjust the height of svg if the bar is too narrow */
					if (barHeight < minBarHeight) {
						barHeight = minBarHeight;
						svgHeight = minBarHeight * (yticks.length * 2 + 1) + margin.top + margin.bottom;
						height = svgHeight - margin.top - margin.bottom;
					}

					var tip = d3.tip()
						.attr('class', 'd3-tip')
						.offset([-10, 0])
						.html(function (d) {
							//return '<strong>' + d[0] + '</strong></br>Percentage: ' + d[1];
							return '<strong>Label:</strong>' +
								'<span style="color: ' + d3.rgb('#393b79').brighter().brighter().brighter() + '">' + d[0] + '</span><br><br>' +
								'<strong>Percentage (%):</strong>' +
								'<span style="color: ' + d3.rgb('#393b79').brighter().brighter().brighter() + '">' + d[1] + '</span>';
							//return '<strong>Frequency:</strong> <span style='color:red'>' + d.frequency + '</span>';
						});

					var svg = d3.select(element.find('.bar-chart')[0])
						.attr('width', thewidth)
						.attr('height', svgHeight)
						.append('g')
						.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

					svg.call(tip);


					var x = d3.scale.linear()
						.domain([0, maxPercentage])
						.range([0, width]);
					var xAxis = d3.svg.axis().scale(x).orient('top');

					var y = d3.scale.ordinal()
						.domain(yticks)
						.rangeBands([0, height], .5);
					var yAxis = d3.svg.axis().scale(y).orient('left');


					var bars = svg.selectAll('.bar')
						.data(data)
						.enter().append('g')
						.attr('transform', function (d, i) {
							var offset = barHeight + i * barHeight / 0.5;
							return 'translate(0,' + offset + ')';
						});

					var rects = bars.append('rect')
						.attr('height', barHeight)
						.style('fill', barFill)
						.on('mouseover', function (d, i) {
							d3.select(rects[0][i]).style('fill', highlightFill);
							if (tipOn) {
								tip.show(d);
							}
						})
						.on('mouseout', function (d, i) {
							d3.select(rects[0][i]).style('fill', barFill);
							if (tipOn) {
								tip.hide(d);
							}
						})
                        .attr('width', function (d) {
							return x(0);
						})
                        .transition()
                        .duration(800)
						.attr('width', function (d) {
							return x(d[1]);
						});

					bars.append('text')
						.attr('x', function (d) {
							return x(d[1]) + 10;
						})
						.attr('y', barHeight / 2)
						.attr('dy', '.35em')
						.text(function (d) {
							return d[2]
						});

					var xAxisGroup = svg.append('g')
						.attr('class', 'x axis')
						.call(xAxis)
						.append('text')
						.attr('text-anchor', 'end')
						.attr('x', width)
						.attr('y', '-2em')
						.text('Percentage (%)');

					var yAxisGroup = svg.append('g').attr('class', 'y axis').call(yAxis);

                    // Add Comment
                    if(scope.comment) {
                        var comment = svg.selectAll('g.comment')
                            .data(scope.comment)
                            .enter()
                            .append('g')
                            .attr('class', 'comment')
                            .attr('transform', function(d, i) {
                                return 'translate(' + ( width - margin.right - 50)  + ',' + (margin.top + i*20) + ')';
                             })
                            .style('fill', '#4A105A');

                        comment.append('circle')
                            .attr('cx', 10)
                            .attr('cy', 10)
                            .attr('r', 4);


                        comment.append('text')
                            .attr('x', 20)
                            .attr('y', 9)
                            .attr('dy', '.35em')
                            .style('text-anchor', 'start')
                            .text(function(d) {
                                console.log('abc', d);
                                return d[0] + " : " + d[1];
                            })
                    }
				}

				drawChart();

				scope.resize = function() {
					scope.$apply(function() {
						scope.chartWidth = (element.parent().width());
						scope.chartWidthMax = scope.height * 2;
					});
					d3.select(element.find('.tip')[0]).selectAll().remove();
					d3.select(element.find('.bar-chart')[0]).selectAll('g').remove();
					drawChart();
				}

				window.addEventListener('resize', function(event){
					clearTimeout(scope.resizetimeout);
					scope.resizetimeout = setTimeout(scope.resize,100);
				});

				setTimeout(scope.resize,100);

			});
		}
	};
});