'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */

app.directive('visGpie', function ($window) {

    return {
        restrict: 'EA',
        scope: {
            data: '=data',
            width: '=width',
            colors: '=colors'
        },
        link: function (scope, element) {
            scope.el = element[0];
            if(scope.width == null) {
                scope.width = 600;
            }
            angular.element(scope.el).width(scope.width);
            angular.element(scope.el).css({display:'block'});
            scope.$watch('data', function (newVal, oldVal) {
                setTimeout(function() {
                    reloadData(scope);
                    drawChart(scope, element);
                },100);
            });

        }
    };

    function reloadData(scope) {
        var tmpdata = scope.data;
        var newData = [['label','value']];
        for(var label in scope.data) {
            newData.push([label,scope.data[label]]);
        }
        scope.formattedData = newData;
    }

    function drawChart(scope, element) {
        var options = {
            title: '',
            sliceVisibilityThreshold: 0,
            height: 300,
            chartArea:{left:0,top:20,width:"100%",height:"90%"}
        };
        if(scope.colors) {
            options.colors = scope.colors;
        }
        var data = google.visualization.arrayToDataTable(scope.formattedData);
        var chart = new google.visualization.PieChart(scope.el);
        chart.draw(data, options);
    }
});