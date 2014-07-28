'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.directive:visLine
 * @description
 * # visLine
 * d3 Line Chart Directive of the dashboardJsApp
 */

app.directive('visLine', function() {
	var dataMaxVal = function(data) {
		var maxVal, key, dataSetMax, first = true;

		for (key in data) {
			dataSetMax = d3.max(data[key].data, function(d) { return d.value });

			if (first) {
				first = false;
				maxVal = dataSetMax;
			}
			else if (dataSetMax > maxVal) {
				maxVal = dataSetMax;
			}
		}

		return maxVal;
	};

	var dataMinVal = function(data) {
		var minVal, key, dataSetMin, first = true;

		for (key in data) {
			dataSetMin = d3.min(data[key].data, function(d) { return d.value });

			if (first) {
				first = false;
				minVal = dataSetMin;
			}
			else if (dataSetMin < minVal) {
				minVal = dataSetMin;
			}
		}

		return minVal;
	};

	var dataExtentDate = function(data) {
		var dateExtent, key, dataSetExtent, first = true;

		for (key in data) {
			dataSetExtent = d3.extent(data[key].data, function(d) { return d.date });

			if (first) {
				first = false;
				dateExtent = dataSetExtent;
			}
			else {
				if (dataSetExtent[0] < dateExtent[0]) {
					dateExtent[0] = dataSetExtent[0];
				}

				if (dataSetExtent[1] > dateExtent[1]) {
					dateExtent[1] = dataSetExtent[1];
				}
			}
		}

		return dateExtent;
	};

	var dataEveryDate = function(data) {
		var set;
		var allDates = d3.time.scale().domain(dataExtentDate(data)).ticks(d3.time.days, 1);

		for (set in data) {
			var availableData = data[set]['data'];

			data[set]['data'] = [];

			for (var i in allDates) {
				data[set]['data'].push({ date: allDates[i], value: 0 });

				for (var j in availableData) {
					if (+availableData[j].date === +allDates[i]) {
						data[set]['data'][data[set]['data'].length - 1].value = availableData[j].value;
					}
				}
			}	
		}

		return data;
	};

	return {
		restrict: 'EA',
		scope: {
			chartData: '=data',
			height: '=height',
			allDates: '=allDates',
			yAxisLabel: '=yAxisLabel',
		},
		templateUrl: 'scripts/directives/line/line.html',
		link: function(scope, element) {
			if ((scope.yAxisLabel === undefined) || (scope.yAxisLabel === null)) {
				scope.yAxisLabel = '';
			}

			//scope.yAxisLabel = 'asdfadsf';

			scope.$watch('chartData', function() {
				if ((scope.chartData !== undefined) && (scope.chartData !== null) && (scope.chartData !== [])) {
					var parseDate = d3.time.format('%Y-%m-%d').parse;

					for (var i in scope.chartData) {
						for (var j in scope.chartData[i].data) {
							scope.chartData[i].data[j].date = parseDate(scope.chartData[i].data[j].date);
						}
					}

					if ((scope.allDates !== undefined) && (scope.allDates)) {
						scope.chartData = dataEveryDate(scope.chartData);
					}

					var nameList = [];

					scope.chartData.forEach(function(d) {
						nameList.push(d.name);
					});

					var color = d3.scale.category10();

					color.domain(nameList);

					var drawChart = function() {
						var margin = { top: 40, right: 200, bottom: 60, left: 120 },
							width = window.innerWidth - 240 - margin.left - margin.right,
							height = scope.height - margin.top - margin.bottom;

						var x = d3.time.scale()
							.domain(dataExtentDate(scope.chartData))
							.range([0, width]);

						var y = d3.scale.linear()
							.domain([0, dataMaxVal(scope.chartData)])
							.range([height, 0]);

						var xAxis = d3.svg.axis()
							.scale(x)
							//.ticks(d3.time.day, 20)
							.tickFormat(d3.time.format('%d-%m-%Y'))
							.orient('bottom');

						var yAxis = d3.svg.axis()
							.scale(y)
							.orient('left');

						var line = d3.svg.line()
							.x(function(d) { return x(d.date) })
							.y(function(d) { return y(d.value) });

						var svg = d3.select(element.find('.line-chart')[0])
							.attr('width', width + margin.left + margin.right)
							.attr('height', height + margin.top + margin.bottom)
							.append('g')
							.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

						var tip = d3.tip()
							.attr('class', 'd3-tip')
							.offset([-10, 0])
							.html(function(d, name) {
								return '<strong>Date:</strong>' +
								'<span style="color: ' + color(name) +'">' + ('0' + d.date.getDate()).slice(-2) + '-' + ('0' + (d.date.getMonth()+1)).slice(-2) + '-' + d.date.getFullYear() + '</span>' +
								'<strong>Value:</strong>' +
								'<span style="color: ' + color(name) +'">' + d.value + '</span>';
							})

						svg.call(tip);

						svg.append('g')
							.attr('class', 'x axis')
							.attr('transform', 'translate(0,' + height + ')')
							.call(xAxis);

						svg.append('g')
							.attr('class', 'y axis')
							.call(yAxis)
							.append('text')
							.attr('transform', 'rotate(-90)')
							.attr('y', -80)
							.attr('x', -0.5 * height)
							.attr('dy', '.71em')
							.style('text-anchor', 'middle')
							.text(scope.yAxisLabel);

						var series = svg.selectAll('.series')
							.data(scope.chartData)
							.enter().append('g')
							.attr('class', 'series');

						series.append('path')
							.attr('class', 'line')
							.attr('d', function(d) { return line(d.data) })
							.style('stroke', function(d) { return color(d.name) });

						series.selectAll('.point')
							.data(function(d) { return d.data })
							.enter().append('circle')
							.attr('class', 'point')
							.attr('cx', function(d) { return x(d.date) })
							.attr('cy', function(d) { return y(d.value) })
							.attr('r', 3)
							.attr('fill', function(d) {
								return color(d3.select(this.parentNode).datum().name);
							})
							.on('mouseover', function(d) {
								d3.select(this)
									.transition()
									.duration(200)
									.attr('r', 5);

								tip.show(d, d3.select(this.parentNode).datum().name);
							})
							.on('mouseout', function(d) {
								d3.select(this)
									.transition()
									.duration(200)
									.attr('r', 3);

								tip.hide(d, d3.select(this.parentNode).datum().name);
							});

						var legend = d3.select(element.find('.line-chart')[0]).append('g')
							.attr('class', 'legend')
							.selectAll('.series-legend')
							.data(scope.chartData)
							.enter().append('g')
							.attr('class', 'series-legend');

						legend.append('rect')
							.attr('x', width + margin.left + 40)
							.attr('y', function(d, i) { return i * 30 + margin.top })
							.attr('width', 20)
							.attr('height', 20)
							.style('fill', function(d) { return color(d.name) });

						legend.append('text')
							.attr('x', width + margin.left + 70)
							.attr('y', function(d, i) { return (i *  30) + 15 + margin.top })
							.text(function(d) { return d.name });
					}

					drawChart();

					window.addEventListener('resize', function(event){
						d3.select(element.find('.line-chart')[0]).selectAll('g').remove();
						drawChart();
					});
				}
			});
		}
	};
});