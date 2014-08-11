'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.directive:visLine
 * @description
 * # visLine
 * d3 Line Chart Directive of the dashboardJsApp
 */

app.directive('visStackedarea', function() {
	return {
		restrict: 'EA',
		scope: {
			data: '=data',
			width: '=width',
			height: '=height',
            option: '=?',
		},
		templateUrl: 'scripts/directives/stackedarea/stackedarea.html',
        controller: function($scope) {
            $scope.option = $scope.option || false;
        },
		link: function(scope, element) {

            scope.filtertype_sequential = true;
            scope.filtertype_video = true;
            scope.filtertype_problem = true;


            scope.$watch('filtertype_sequential', function(value) {
                drawChart();
            });
            scope.$watch('filtertype_video', function(value) {
                drawChart();
            });
            scope.$watch('filtertype_problem', function(value) {
                drawChart();
            });

            var drawChart = function() {

                var thewidth = scope.width;
                if (!thewidth) {
                    thewidth = element.parent().width();
                    if(thewidth < 0) {
                        thewidth = 900;
                    }
                }
                if(thewidth < 900) {
                    thewidth = 900;
                }

                //Set variables
                var margin = {top: 20, right: 0, bottom: 400, left: 50};
                var margin2 = {top: 630, right: 0, bottom: 20, left: 50};
                var width  = thewidth - margin.left - margin.right;
                var height = 800  - margin.top  - margin.bottom;
                var height2 = 800  - margin2.top  - margin2.bottom;

                var x = d3.scale.ordinal().rangeRoundBands([-100, width+100], .1, .1);
                var x2 = d3.scale.ordinal().rangeRoundBands([0, width], 1, 0);

                var y = d3.scale.linear().rangeRound([height, 0]);
                var y2 = d3.scale.linear().rangeRound([height2, 0]);


                var xAxis = d3.svg.axis().scale(x).orient("bottom");
                var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");

                xAxis.tickFormat(function(d,i){
                    return d.substring(0, d.indexOf('_url_'));
                });

                xAxis2.tickFormat(function(d,i){
                    return '';
                });

                var yAxis = d3.svg.axis().scale(y).orient("left");

                var brush = d3.svg.brush().x(x2).on("brush", brushed);

                var stack = d3.layout.stack()
                  .offset("zero")
                  .values(function (d) { return d.values; })
                  .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
                  .y(function (d) { return d.value; });

                var area = d3.svg.area()
                  .interpolate("monotone")
                  .x(function (d) { var dx = x(d.label);  if(!dx) { console.log("WTF"+d.label); dx = 0; } return dx + x.rangeBand() / 2; })
                  .y0(function (d) { return y(d.y0); })
                  .y1(function (d) { return y(d.y0 + d.y); });

                var area2 = d3.svg.area()
                    .interpolate("monotone")
                    .x(function(d) { return x2(d.label) + x.rangeBand() / 2; })
                    .y0(function (d) { return y2(d.y0); })
                    .y1(function (d) { return y2(d.y0 + d.y); });

                //Colours
                var color = d3.scale.category20(); //d3.scale.ordinal().range(["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"]);

                //Delete Everything That Was Already There
                d3.select(element.find('.stackedarea-chart')[0]).selectAll('svg').remove();



                //Append SVG
                var svg = d3.select(element.find('.stackedarea-chart')[0]).append("svg")
                  .attr("width",  width  + margin.left + margin.right)
                  .attr("height", height + margin.top  + margin.bottom);

                //INCLUDE LATER
                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var focus = svg.append("g")
                    .attr("class", "focus")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var context = svg.append("g")
                    .attr("class", "context")
                    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

                context.append("rect")
                    .attr("class", "context_bg")
                    .attr("x",0.5)
                    .attr("y",0.5)
                    .attr("width", width-1)
                    .attr("height", height2);

                if(!scope.data) {
                    return;
                }

                var data = [];
                for(var index in scope.data) {
                    var d = scope.data[index];
                    if(
                    scope.filtertype_sequential && d.Activity.tag == 'sequential' ||
                    scope.filtertype_video && d.Activity.tag == 'video' ||
                    scope.filtertype_problem && d.Activity.tag == 'problem') {
                        data.push(d);
                    }
                }

                console.log("###");
                console.log(data);
                console.log("%%%");

                var labelVar = 'Activity';
                var varNames = d3.keys(data[0])
                    .filter(function (key) { return key !== labelVar;});
                color.domain(varNames);

                var seriesArr = [], series = {};
                varNames.forEach(function (name) {
                  series[name] = {name: name, values:[]};
                  seriesArr.push(series[name]);
                });

                data.forEach(function (d) {
                    varNames.map(function (name) {
//                        if(
//                        scope.filtertype_sequential && d.Activity.tag == 'sequential' ||
//                        scope.filtertype_video && d.Activity.tag == 'video' ||
//                        scope.filtertype_problem && d.Activity.tag == 'problem') {
                            series[name].values.push({name: name, label: d.Activity.uid, value: +d[name]});
//                        }
                    });
                });

                stack(seriesArr);

                x.domain(data.map(function (d) { return d.Activity.uid; }));

                y.domain([0, d3.max(seriesArr, function (c) {
                    return d3.max(c.values, function (d) { return d.y0 + d.y; });
                  })]);

                x2.domain(x.domain());
                y2.domain(y.domain());


                //FOCUS
                var focus_selection = focus.selectAll(".series")
                    .data(seriesArr)
                    .enter().append("g")
                        .attr("class", "series");

                focus_selection.append("path")
                    .attr("class", "streamPath")
                    .attr("d", function (d) { return area(d.values); })
                    .style("fill", function (d) { return color(d.name); })
                    .style("stroke", "grey");

                focus.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", function(d) {
                            return "rotate(-65)"
                        });

                focus.append("g")
                    .attr("class", "y axis")
                    .call(yAxis);

                redrawpoints();

                //CONTEXT
                var selection2 = context.selectAll(".series")
                    .data(seriesArr)
                    .enter().append("g")
                        .attr("class", "series");

                selection2.append("path")
                    .attr("class", "streamPath")
                    .attr("d", function (d) { return area2(d.values); })
                    .style("fill", function (d) { return color(d.name); })
                    .style("stroke", "grey");

//                context.append("g")
//                    .attr("class", "x axis")
//                    .attr("transform", "translate(0," + height2 + ")")
//                    .call(xAxis2);

                context.append("g")
                        .attr("class", "x brush")
                        .call(brush)
                    .selectAll("rect")
                        .attr("y", -6)
                        .attr("height", height2 + 7);

                function redrawpoints() {
                    console.log("REDRAWING POINT");
                    focus.selectAll(".seriesPoints").remove();
                    var points = focus.selectAll(".seriesPoints")
                      .data(seriesArr)
                      .enter().append("g")
                        .attr("class", "seriesPoints");

                    points.selectAll(".point")
                      .data(function (d) { return d.values; })
                      .enter().append("circle")
                       .attr("class", "point")
                       .attr("cx", function (d) { var xpos = x(d.label) + x.rangeBand() / 2; if(!xpos) {xpos = 0}; if(d.value < 1) { xpos = -200; } return xpos; })
                       .attr("cy", function (d) { return y(d.y0 + d.y); })
                       .attr("r", "10px")
                       .style("fill",function (d) { return color(d.name); })
                       .on("mouseover", function (d) { showPopover.call(this, d); })
                       .on("mouseout",  function (d) { removePopovers(); })

                    console.log("@@@"+varNames.length);

                    svg.selectAll(".legend_bg").remove()
                    svg.append("rect")
                        .attr("class", "legend_bg")
                        .attr('x', width-(varNames.length*90)-0.5)
                        .attr('y', 0)
                        .attr("width", Math.round((varNames.length*90)+50-0.5))
                        .attr("height", 40);

                    var legend = svg.selectAll(".legend")
                        .data(varNames.slice().reverse())
                      .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function (d, i) { return "translate("+ (width - (i*90) - 25) +",14)"; });

                    legend.append("rect")
                        .attr("y", 0.5)
                        .attr("x", 55 - 24+0.5)
                        .attr("width", 15)
                        .attr("height", 15)
                        .style("fill", color)
                        .style("stroke-width","1")
                        .style("stroke", "#333333");

                    legend.append("text")
                        .attr("x", 55 - 28)
                        .attr("y", 8)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .text(function (d) { return d; });
                }

                function brushed() {
                    var newdomain = x2.domain();
                    var subseriesArr = $.extend(true, [], seriesArr);
                    if(!brush.empty()) {
                        var extent = brush.extent();
                        var d = x2.domain();
                        var r = x2.range();
                        var range = extent.map(function (e) {
                            return d[d3.bisect(r, e) - 1];
                        });
                        var olddomain = newdomain;
                        var newdomain = [];
                        var started = false;
                        for (var obj in olddomain) {
                            if (olddomain[obj] == range[0]) {
                                started = true;
                            }
                            if (started) {
                                newdomain.push(olddomain[obj]);
                            }
                            if (olddomain[obj - 1] == range[1]) {
                                break;
                            }
                        }

                        for(var index in subseriesArr) {
                            var vals = subseriesArr[index]['values'];

                            for(var vindex = vals.length-1; vindex > -1; vindex--) {
                                if(newdomain.indexOf(vals[vindex]['label']) == -1) {
                                    subseriesArr[index]['values'].splice(vindex, 1);
                                }
                            }
                        }
                    }
                    //x.domain(newdomain.map(function (d) { return d.Activity.uid; }));
                    x.domain(newdomain);

                    focus.selectAll(".series").remove();
                    focus_selection = focus.selectAll(".series")
                        .data(subseriesArr)
                        .enter().append("g")
                            .attr("class", "series");
                    console.log("REDRAW");
                    console.log(subseriesArr);

                    focus_selection.append("path")
                        .attr("class", "streamPath")
                        .attr("d", function (d) { return area(d.values); })
                        .style("fill", function (d) { return color(d.name); })
                        .style("stroke", "grey");

                    focus.selectAll(".x.axis").remove();

                    focus.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", function(d) {
                            return "rotate(-65)"
                        });

                    redrawpoints();
                }

                function removePopovers () {
                  $('.popover').each(function() {
                    $(this).remove();
                  });
                }

                function showPopover (d) {
                  $(this).popover({
                      title: d.name,
                      placement: 'auto top',
                      container: 'body',
                      trigger: 'manual',
                      html: true,
                      content: function () {
                          return "Activity: " + d.label +
                              "<br/>Number of students: " + d.value
                      }
                  });
                  $(this).popover('show')
                }

            };
            scope.$watch('data', function() {
                drawChart();
            });

            scope.resize = function() {
                scope.$apply(function() {
                    scope.chartWidth = (element.parent().width());
                    scope.chartWidthMax = scope.height * 2;
                });
                drawChart();
            }

            window.addEventListener('resize', function(event){
                clearTimeout(scope.resizetimeout);
                scope.resizetimeout = setTimeout(scope.resize,100);
            });

            setTimeout(scope.resize,100);

		}
	};
});