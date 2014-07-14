'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.directive:visLine
 * @description
 * # visLine
 * d3 Line Chart Directive of the dashboardJsApp
 */

app.directive('visStackedbar', function() {
	return {
		restrict: 'EA',
		scope: {
			data: '=data',
			width: '=width',
			height: '=height',
            option: '=?',
		},
		templateUrl: 'scripts/directives/stackedbar/stackedbar.html',
        controller: function($scope) {
            $scope.option = $scope.option || false;
        },
		link: function(scope, element) {
            var data = scope.data;

            var dataset = data.stackData;
            var stack = d3.layout.stack();
            stack(dataset);
            console.log(dataset);

            var stackNames = data.stackNames;
            var colors = d3.scale.category10();
            var legendOn = true;
            var legendPosition = "right";
            var rulesOn = true;
            var margin = {top: 20, right: 20, bottom: 40, left: 100};
            var tipOn = true;
            if (scope.option !== false) {
                margin = (scope.option.margin == null) ? margin : scope.option.margin;
                colors = (scope.option.colors == null) ? colors : d3.scale.ordinal().range(scope.option.colors);
                legendOn = (scope.option.legendOn === null) ? legendOn : scope.option.legendOn;
                legendPosition = (scope.option.legendPosition == null) ? legendPosition : scope.option.legendPosition;
                rulesOn = (scope.option.rulesOn === null) ? rulesOn : scope.option.rulesOn;
                tipOn = (scope.option.tipOn == null) ? tipOn : scope.option.tipOn;
            }

            var width = scope.width - margin.right - margin.left,
                height = scope.height - margin.top - margin.bottom;

            var svg = d3.select(element.find('.stackedbar-chart')[0])
                .attr("width", scope.width)
                .attr("height", scope.height)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.scale.ordinal()
                .domain(data.xTicks)
                .rangeBands([0, width], .5);
            var xAxis = d3.svg.axis().scale(x).orient('bottom');

            var yMax = d3.max(dataset, function (d) {
                return d3.max(d, function (d) {
                    return d.y0 + d.y;
                });
            });
            var y = d3.scale.linear()
                .domain([0, yMax])
                .range([height, 0]);

            var yAxis = d3.svg.axis().scale(y).orient('left');

            var groups = svg.selectAll("g")
                .data(dataset)
                .enter()
                .append("g")
                .attr("data-class", function(d, i) {
                    return stackNames[i];
                })
                .style("fill", function (d, i) {
                    return colors(i);
                });

            var tip = d3.tip()
                .attr("class", 'd3-tip')
                .offset([-10, 0])
                .html(function (d) {
                    return d;
                });
            svg.call(tip);

            var rects = groups.selectAll("rect")
                .data(function (d) {
                    return d;
                })
                .enter()
                .append("rect")
                .attr("x", function (d) {
                    return x(d.x);
                })
                .attr("y", function (d) {
                    return y(d.y0 + d.y);
                })
                .attr("width", x.rangeBand())
                .attr("height", function (d) {
                    return y(d.y0) - y(d.y + d.y0);
                })
                .on("mouseover", function(d) {
                    d3.select(this).style("stroke-width", 2.5);
                    d3.select(this).style("stroke", "LightGray");
                    if(tipOn) {
                        var tipStr = "";
                        if (d.comment) {
                            tipStr = d.comment;
                        }
                        else {
                            tipStr = "<strong>" + data.xAxisName + ":</strong> " + d.x + "</br>"
                                + "<strong>" + data.yAxisName + ":</strong>" + "</br>"
                                + "<em>&nbsp&nbsp" + d3.select(this.parentNode).attr("data-class") + ":</em> " + d.y;
                        }
                        tip.show(tipStr);
                    }
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("stroke-width", 0);
                    if(tipOn) {
                        tip.hide();
                    }

                });


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            svg.append("text")
                .attr("transform", "translate(" + (width/2) + "," + height + ")")
                .attr("class", "x axisname")
                .attr("dy", "2.2em")
                .text(data.xAxisName);

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append('text')
                .attr("transform", 'rotate(-90)')
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height/2))
                .attr("dy", "1em")
                .attr("class", "y axisname")
                .text(data.yAxisName);

            // Add y-axis rules.
            if (rulesOn) {
                var rule = svg.selectAll("g.rule")
                    .data(y.ticks())
                    .enter()
                    .append("g")
                    .attr("class", "rule")
                    .attr("transform", function (d) {
                        return "translate(0," + y(d) + ")";
                    });
                rule.append("line")
                    .attr("x2", width);
            }

            // Add legend.
            if (legendOn) {
                var legend = svg.selectAll("g.legend")
                    .data(stackNames)
                    .enter()
                    .append("g")
                    .attr("class", "legends")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

                var bPosition;
                switch(legendPosition)  {
                    case "left":
                        bPosition = 0;
                        break;
                    case "middle":
                        bPosition = width /2;
                        break;
                    case "right":
                        bPosition = width - 18;
                        break;
                    default:
                        if ( legendPosition >= 0 && legendPosition <= 1) {
                            bPosition = width * legendPosition;
                        }
                        else {
                            bPosition = width - 18;
                    }
                        break;
                }
                legend.append("rect")
                    .attr("x", bPosition)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", function (d, i) {
                        return colors(i)
                    });

                legend.append("text")
                    .attr("x", bPosition - 6)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return d;
                    });
            }

		}
	};
});