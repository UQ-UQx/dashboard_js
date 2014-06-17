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
            width: '=width'
        },
        templateUrl: 'scripts/directives/pie/pie.html',
        link: function (scope, element) {
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

        }
    };

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
});