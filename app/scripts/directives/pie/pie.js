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
            var data = scope.data;
            console.log(data);

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d)  {return d.value;});

            var margin = {top: 20, right: 150, bottom: 20, left: 20};
            var colors = d3.scale.category20();
            var tipOn = true;

            var width = scope.width - margin.right - margin.left,
                height = scope.height - margin.top - margin.bottom;

            var radius = d3.min([width, height]) /2;



            var arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(0);




            var svg = d3.select(element.find('.pie-chart')[0])
                .attr('width', scope.width)
                .attr('height', scope.height)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            var tip = d3.tip()
                .attr("class", 'd3-tip')
                .html(function (d) {
                    var tipStr = "";
                    if (d.data.comment) {
                        tipStr = d.data.comment;
                    }
                    else {
                        tipStr = "<strong>" + d.data.label + ": </strong>" + d.value + " (" + (d.value / sum * 100).toFixed(1) + "%)";
                    }
                    return tipStr;
                })
                .offset(function(d) {
                    //return [0, 0];

                    //var x1 = Math.sin(d.startAngle) * radius;
                    //var y1 = Math.cos(d.startAngle) * radius;
                    //treturn [y1,x1];
                    /*
                    var c = arc.centroid(d);
                    console.log(c[0]);
                    console.log(c[1]);
                    var x = c[0] - x1;
                    var y = c[1] - y1;
                    console.log( x1 + "    " + y1);
                    console.log(d);
                    console.log(arc.centroid(d));
                    return [y1, -x1];
                    */
                });
            console.log(svg);
            svg.call(tip);

            var arcs = svg.selectAll('g.arc')
                .data(pie(data))
                .enter()
                .append('g')
                .attr('class', 'arc')
                .attr('transform', 'translate(' + width/2 + ',' + height/2 + ')');

            var sum = d3.sum(data, function(d) {
                return d.value;
            });

            arcs.append('path')
                .attr('fill', function(d, i) {
                    return colors(i);
                })
                .attr('d', arc)
                .on("mouseover", function(d, i) {

                    d3.select(this).style("stroke-width", 3);
                    d3.select(this).style("stroke", d3.rgb(colors(i)).brighter(0.7));

                    if (tipOn) {
                        tip.show(d);
/*
                        var tipStr = "";
                        if (d.data.comment) {
                            tipStr = d.data.comment;
                        }
                        else {
                            tipStr = "<strong>" + d.data.label + ": </strong>" + d.value + " (" + (d.value / sum * 100).toFixed(1) + "%)";
                        }
                        tip.show(tipStr);
*/
                  }
                })
                .on("mouseout", function(d) {
                    d3.select(this).style("stroke-width", 0);
                    if(tipOn) {
                        tip.hide();
                    }
                });

            arcs.append("text")
                .attr("transform", function(d) {
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .text(function(d) {
                    // Only show text when the arc is large enough
                    if((d.endAngle - d.startAngle) > 0.22) {
                        //console.log(d);
                        return d.value;
                    }
                });

            // Add legend.
            var legend = svg.selectAll("g.legend")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "legends")
                .attr("transform", function(d, i) {
                   return "translate(" + ( width + margin.left ) + "," + i * 20 + ")";
                })
                .style("fill", function(d, i) {
                    return colors(i);
                });

            console.log(legend);

            legend.append("rect")
                .attr("width", 18)
                .attr("height", 18);

            legend.append("text")
                .attr("x", 20)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function (d) {
                    return d.label;
                });








/*
            scope.el = element[0];
            scope.d3data = [];
            scope.resizeTimeout = null;
            scope.$watch('data', function (newVal, oldVal) {
                console.log("RELOADING DATA");
                reloadData(scope);
                drawChart(scope, element);
            });

            var w = angular.element($window);
            w.bind('resize', function () {
                resizeStartTimeout(w, scope);
            });
            resize(w, scope);
*/
        }
    };

    /*
    function resizeStartTimeout(w, scope) {
        clearTimeout(scope.resizeTimeout);
        scope.resizeTimeout = setTimeout(function () {
            resize(w, scope)
        }, 100);
    }

    function resize(w, scope) {
        console.log(w.width());
    }

    function drawChart(scope) {
        var w = scope.width;
        var h = scope.width;
        var r = h / 2;
        var color = d3.scale.category20c();

        d3.select(scope.el).select("svg").remove();
        d3.select(scope.el).append("svg:svg");

        var svg = d3.select(scope.el).select("svg");
        var vis = svg.data([scope.d3data]).attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + r + "," + r + ")");
        var arc = d3.svg.arc().outerRadius(r);
        var pie = d3.layout.pie().value(function (d) {
            return d.value;
        });
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path").attr("fill",function (d, i) {
            return color(i);
        }).attr("d", arc);
        arcs.append("svg:text").attr("transform",function (d) {
            d.innerRadius = 0;
            d.outerRadius = r;
            return "translate(" + arc.centroid(d) + ")";
        }).attr("text-anchor", "middle").text(function (d, i) {
            return d.data.label;
        });
        drawLegend(scope);
    }

    function drawLegend(scope) {
        svg = d3.select(scope.el).select("svg");
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("x", w - 65)
            .attr("y", 25)
            .attr("height", 100)
            .attr("width", 100);

        legend.append("rect")
            .attr("x", w - 65)
            .attr("y", 25)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d) {
                return '#333333';
            });
    }

    function reloadData(scope) {
        var tmpdata = scope.data;
        for (var key in tmpdata) {
            var item = {};
            item.label = "" + key;
            item.value = "" + tmpdata[key];
            scope.d3data.push(item);
        }
        //d3data = [{ label: '0-10', value: '3' }, { label: '11-20', value: '5' }, { label: '21-100', value: '5'}];
    }
    */
});