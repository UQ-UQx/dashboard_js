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
		},
		templateUrl: 'scripts/directives/bar/bar.html',
		link: function(scope, element) {
            var data = scope.data.data;

            var countries = []
            var maxPercentage = 0;
            for(var i = 0; i < data.length; i++)  {
                countries.push(data[i][0]);
                if(data[i][1] > maxPercentage) {
                    maxPercentage = data[i][1];
                }
            }

            /* 5% is the default ceil unit */
            var ceilUnit = (scope.data.ceilUnit == null) ? 5 : scope.data.ceilUnit;
            maxPercentage = Math.ceil(maxPercentage/ceilUnit) * ceilUnit;

            var margin = (scope.data.margin == null) ? {top: 40, right: 40, bottom: 60, left: 150} : scope.data.margin;
            var width = scope.width - margin.right - margin.left,
                height = scope.height - margin.top - margin.bottom;

            var svg = d3.select(element.find('.bar-chart')[0])
                        .attr("width", scope.width)
                        .attr("height", scope.height)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            var x = d3.scale.linear()
                .domain([0, maxPercentage])
                .range([0, width]);
            var xAxis = d3.svg.axis().scale(x).orient('top');

            var y = d3.scale.ordinal()
                .domain(countries)
                .rangeBands([0, height],.5);
            var yAxis = d3.svg.axis().scale(y).orient('left');


            var barHeight = y.rangeBand();
            var bars = svg.selectAll('.bar')
                .data(data)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    var offset = barHeight + i * barHeight / 0.5;
                    return "translate(0," + offset + ")";});

            bars.append("rect")
                .attr("width", function (d) { return x(d[1]);})
                .attr("height", barHeight)
                .attr('class', 'bar');


            bars.append("text")
                .attr("x", function(d) {return x(d[1]) + 2;})
                .attr("y", barHeight /2)
                .attr("dy", ".35em")
                .text(function(d) {return d[2]});






            var xAxisGroup = svg.append('g').
                attr('class', 'x axis')
                .call(xAxis)
                .append("text")
                .attr("text-anchor", "end")
                .attr("x", width )
                .attr("y", "-2em")
                .text("Percentage");

            var yAxisGroup = svg.append('g').attr('class', 'y axis').call(yAxis);






/*
			scope.chartData = [];
			scope.chartDataTwo = [];

			var parseDate = d3.time.format('%Y-%m-%d').parse;

			for (var i in scope.data) {
				scope.chartData.push({ date: parseDate(scope.data[i].x), close: scope.data[i].y });
			}
			for (var i in scope.data) {
				scope.chartDataTwo.push({ date: parseDate(scope.data[i].x), close: (scope.data[i].y + 10) });
			}

			var margin = { top: 40, right: 40, bottom: 60, left: 100 },
				width = 960 - margin.left - margin.right,
				height = 500 - margin.top - margin.bottom;

			var x = d3.time.scale()
				.range([0, width]);

			var y = d3.scale.linear()
				.domain([0, d3.max(scope.chartData, function(d) { return d.close })])
				.range([height, 0]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.ticks(d3.time.day, 1)
				.tickFormat(d3.time.format('%d-%m-%Y'))
				.orient('bottom');

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient('left');

			var line = d3.svg.line()
				.x(function(d) { return x(d.date) })
				.y(function(d) { return y(d.close) });

			var svg = d3.select(element.find('.bar-chart')[0])
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

			x.domain(d3.extent(scope.chartData, function(d) { return d.date }));

			svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + height + ')')
				.call(xAxis);

			svg.append('g')
				.attr('class', 'y axis')
				.call(yAxis)
				.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('y', -50)
				.attr('x', -150)
				.attr('dy', '.71em')
				.style('text-anchor', 'end')
				.text('Num. Registration');

			svg.append('path')
				.datum(scope.chartData)
				.attr('class', 'line')
				.attr('d', line);

			svg.append('path')
				.datum(scope.chartDataTwo)
				.attr('class', 'line')
				.attr('d', line);

			svg.selectAll('circle')
				.data(scope.chartData)
				.enter().append('circle')
				.attr('class', 'point')
				.attr('cx', function(d) { return x(d.date) })
				.attr('cy', function(d) { return y(d.close) })
				.attr('r', 3)
				.on('mouseover', function(d) {
					var chartTip = $($(this).closest('vis-line').find('.tip')[0]);
					var dateFormat = d3.time.format('%Y-%m-%d').parse;

					chartTip.css('left', (event.clientX + 15) + 'px' );
					chartTip.css('top', (event.clientY - 45) + 'px');

					chartTip.html(
						'<dl>' +
							'<dt>Date:</dt><dd>' + ('0' + d.date.getDate()).slice(-2) + '-' + ('0' + (d.date.getMonth()+1)).slice(-2) + '-' + d.date.getFullYear() + '</dd>' +
							'<dt>Registrations:</dt><dd>' + d.close + '</dd>' +
						'</dl>'
					);
					chartTip.fadeIn(100);

					d3.select(this)
						.transition()
						.duration(200)
						.attr('r', 5);
				})
				.on('mouseout', function() {
					var chartTip = $($(this).closest('vis-line').find('.tip')[0]);

					chartTip.fadeOut(50);

					d3.select(this)
						.transition()
						.duration(200)
						.attr('r', 3);
				});
				*/
		}
	};
});