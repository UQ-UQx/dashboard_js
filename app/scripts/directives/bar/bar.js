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
            option: '=?',
		},
		templateUrl: 'scripts/directives/bar/bar.html',
        controller: function($scope) {
            $scope.option = $scope.option || false;
        },
		link: function(scope, element) {
            //console.log(scope.option);
            var data = scope.data;

            var countries = []
            var maxPercentage = 0;
            for(var i = 0; i < data.length; i++)  {
                countries.push(data[i][0]);
                if(data[i][1] > maxPercentage) {
                    maxPercentage = data[i][1];
                }
            }

            /* default chart options */
            var barFill = 'steelblue',
                highlightFill = 'brown',
                tipOn = true,
                ceilUnit = 5,
                margin = {top: 40, right: 40, bottom: 20, left: 150},
                minBarHeight = 7;
            /* custom default options */
            if(scope.option !== false)  {
                barFill = (scope.option.barFill == null) ? barFill : scope.option.barFill;
                highlightFill = (scope.option.highlightFill == null) ? highlightFill : scope.option.highlightFill;
                tipOn = (scope.option.tipOn == null) ? tipOn : scope.option.tipOn;
                ceilUnit = (scope.option.ceilUnit == null) ? ceilUnit : scope.option.ceilUnit;
                margin = (scope.option.margin == null) ? margin : scope.option.margin;
                minBarHeight = (scope.option.minBarHeight == null) ? minBarHeight : scope.option.minBarHeight;
            }

            maxPercentage = Math.ceil(maxPercentage/ceilUnit) * ceilUnit;
            var width = scope.width - margin.right - margin.left,
                height = scope.height - margin.top - margin.bottom;

            var barHeight = height/(countries.length * 2 + 1);
            var svgHeight = scope.height;
            /* adjust the height of svg if the bar is too narrow */
            if (barHeight < minBarHeight) {
                barHeight = minBarHeight;
                svgHeight = minBarHeight * (countries.length *2 +1) + margin.top + margin.bottom;
                height = svgHeight - margin.top - margin.bottom;
            }

            var tip = d3.tip()
                  .attr('class', 'd3-tip')
                  .offset([-10, 0])
                  .html(function(d) {
                    return "<strong>" + d[0] + "</strong></br>Percentage: " + d[1];
                    //return "<strong>Frequency:</strong> <span style='color:red'>" + d.frequency + "</span>";
             });

            var svg = d3.select(element.find('.bar-chart')[0])
                        .attr("width", scope.width)
                        .attr("height", svgHeight)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.call(tip);


            var x = d3.scale.linear()
                .domain([0, maxPercentage])
                .range([0, width]);
            var xAxis = d3.svg.axis().scale(x).orient('top');

            var y = d3.scale.ordinal()
                .domain(countries)
                .rangeBands([0, height],.5);
            var yAxis = d3.svg.axis().scale(y).orient('left');


            var bars = svg.selectAll('.bar')
                .data(data)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    var offset = barHeight + i * barHeight / 0.5;
                    return "translate(0," + offset + ")";});

            var rects = bars.append("rect")
                .attr("width", function (d) { return x(d[1]);})
                .attr("height", barHeight)
                .style('fill', barFill)
                .on("mouseover", function(d, i) {
                    d3.select(rects[0][i]).style('fill', highlightFill);
                    if(tipOn) {
                        tip.show(d);
                    }
                })
                .on("mouseout", function(d, i) {
                    d3.select(rects[0][i]).style('fill', barFill);
                    if(tipOn) {
                        tip.hide(d);
                    }
                });

            bars.append("text")
                .attr("x", function(d) {return x(d[1]) + 2;})
                .attr("y", barHeight /2)
                .attr("dy", ".35em")
                .text(function(d) {return d[2]});

            var xAxisGroup = svg.append('g')
                .attr('class', 'x axis')
                .call(xAxis)
                .append("text")
                .attr("text-anchor", "end")
                .attr("x", width )
                .attr("y", "-2em")
                .text("Percentage");

            var yAxisGroup = svg.append('g').attr('class', 'y axis').call(yAxis);

		}
	};
});