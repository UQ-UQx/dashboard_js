'use strict';

app.directive('visStackedarea2', function() {
    return {
		restrict: 'EA',
		scope: {
			data: '=data',
			width: '=width',
			height: '=height',
            ndata: '=?',
            option: '=?'
		},
		templateUrl: 'scripts/directives/stackedarea2/stackedarea2.html',
        link: function(scope, element) {

            var wrapText = function(text, labelWidth) {
                text.each(function() {
                ///*
                    var text = d3.select(this);
                    var words = text.text().split(/\s+/).reverse();
                    // We only split the lable into two lines
                    var y = text.attr("y"),
                        dy0 = "0.15em",
                        dy1 = "-0.4em",
                        dy2 = "0.65em",
                        line = [],
                        ll = 0,
                        word;

                    //console.log('words', words);
                    var tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy0);
                    while((word = words.pop()) && ll < 2) {
                        line.push(word);
                        tspan.text(line.join(" "));
                        if(tspan.node().getComputedTextLength() > labelWidth) {
                            ll++;
                            line.pop();
                            if(ll === 1) {
                                tspan.text(line.join(" ")).attr("dy", dy1);
                                line = [word];
                                //console.log(words.length);
                                tspan = text.append("tspan").attr("x", -10).attr("y", y).attr("dy", dy2);
                                if(words.length == 0) {
                                    tspan.text(line.join(" "));
                                }
                            }
                            else {
                                line.push("...");
                                tspan.text(line.join(" "));
                            }
                        }
                   }
                //*/
                 if( ll == 1) {
                     text.style("text-anchor", 'end')
                         .attr("dx", "-.8em")
                         //.attr("dy", ".15em")
                         .attr("transform", "rotate(-65)");
                 }
                 else {
                     text.style("text-anchor", 'end')
                         .attr("dx", "-.8em")
                         //.attr("dy", ".1em")
                         .attr("transform", "rotate(-65)");
                 }

                });
            }

            var drawChart = function() {

                function brushed () {
                    x.domain(brush.empty() ? x2.domain() : brush.extent());
                    focus.selectAll(".area").attr("d", area);
                    var xTickGap = 50,
                        labelCompNum = Math.floor(width / xTickGap);

                    var labelStart = Math.ceil(x.domain()[0]),
                        labelEnd = Math.floor(x.domain()[1]),
                        labelMaxNum = labelEnd - labelStart + 1;
                    var labelNum = (labelMaxNum > labelCompNum) ? labelCompNum : labelMaxNum;
                    xAxis.ticks(labelNum);

                    focus.select(".x.axis").call(xAxis).selectAll("text").call(wrapText,labelheight);
                }


                if(scope.data && scope.ndata) {

                    var thewidth = scope.width;
                    if (!thewidth) {
                        thewidth = element.parent().width();
                        if(thewidth < 0) {
                            thewidth = 900;
                        }
                    }
                    if (thewidth < 900) {
                        thewidth = 900;
                    }

                    // Set Variables
                    var topheight = scope.height*0.8;
                    var bottomheight = scope.height*0.2;
                    var labelheight = 200;
                    var margin = {top: 20, right: 50, bottom: bottomheight+labelheight, left: 120},
                        margin2 = {top: topheight, right: 50, bottom: 20, left: 120};
                    var width = thewidth - margin.left - margin.right;
                    var height = scope.height - margin.top - margin.bottom,
                        height2 = scope.height - margin2.top - margin2.bottom;


                    console.log('layerData', scope.data);
                    console.log('metaData', scope.ndata);


                    var m = scope.ndata.eventList.length;

                    var layers = scope.data;

                    var x = d3.scale.linear()
                        .domain([0, m-1])
                        .range([0, width]);
                    var x2 = d3.scale.linear()
                        .domain([0, m-1])
                        .range([0, width]);

                    var xTickGap = 50,
                        labelCompNum = Math.floor(width / xTickGap);
                    var xAxis = d3.svg.axis().scale(x)
                        .orient('bottom')
                        .tickFormat(function(d,i) {
                            return scope.ndata.eventList[d];
                        })
                        .ticks(labelCompNum);

                    var y = d3.scale.linear()
                        .domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) {return d.y0 + d.y}) })])
                        .range([height, 0]);
                    var y2 = d3.scale.linear()
                        .domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) {return d.y0 + d.y}) })])
                        .range([height2, 0]);

                    var yAxis = d3.svg.axis().scale(y).orient('left');

                    var color = d3.scale.category20c();

                    var brush = d3.svg.brush()
                        .x(x2)
                        .on("brush", brushed);

                    var area = d3.svg.area()
                        .x(function(d) { return x(d.x); })
                        .y0(function(d) { return y(d.y0); })
                        .y1(function(d) { return y(d.y0 + d.y); });

                    var area2 = d3.svg.area()
                        .x(function(d) { return x2(d.x); })
                        .y0(function(d) { return y2(d.y0); })
                        .y1(function(d) { return y2(d.y0 + d.y); });


                    var svg = d3.select(element.find('.stackedarea2-chart')[0])
                        .attr('width', thewidth)
                        .attr('height', scope.height);

                    svg.append("defs").append("clipPath")
                        .attr("id", "clip")
                        .append("rect")
                        .attr("width", width)
                        .attr("height", scope.height);

                    var focus = svg.append('g')
                        .attr('class', 'focus')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                    var context = svg.append('g')
                        .attr('class', 'context')
                        .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

                    context.append('rect')
                        .attr('width',width)
                        .attr('height',height2)
                        .style('fill','#FAFAFA')
                        .style('stroke','#333')
                        .style('stroke-width','1px')


                    focus.selectAll('path')
                        .data(layers)
                        .enter().append('path')
                        .attr("class", "area")
                        .attr('d', area)
                        .style('fill', function(d, i) { return color(i); });

                    var xAxisGroup = focus.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,' + height + ')' )
                        .call(xAxis)
                        .selectAll("text")
                        .call(wrapText,labelheight);

                    var yAxisGroup = focus.append('g')
                        .attr('class', 'y axis')
                        .call(yAxis);


                    context.selectAll('path')
                        .data(layers)
                        .enter().append('path')
                        .attr('d', area2)
                        .style('fill', function(d, i) { return color(i); });

                    context.append("g")
                      .attr("class", "x brush")
                      .call(brush)
                      .selectAll("rect")
                      .attr("y", 0)
                      .attr("height", height2 + 1);
                }
            }

            scope.$watch('data', function() {
                drawChart();
            });

        }
    };
});