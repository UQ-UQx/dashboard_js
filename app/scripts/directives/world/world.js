'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.directive:visLine
 * @description
 * # visLine
 * d3 Line Chart Directive of the dashboardJsApp
 */

app.directive('visWorld', ['COUNTRY', function(COUNTRY) {
	var dataMaxVal = function(data) {
		var maxVal, key, first = true;

		for (key in data) {
			if (first) {
				first = false;
				maxVal = data[key].value;
			}
			else if (data[key].value > maxVal) {
				maxVal = data[key].value;
			}
		}

		return maxVal;
	};

	return {
		restrict: 'EA',

		scope: {
			chartData: '=data',
			colourString: '=colourString',
			height: '=height',
            suffix: '=?'
		},

		templateUrl: 'scripts/directives/world/world.html',

		link: function(scope, element) {
			scope.chartWidth = (window.innerWidth - 240);
			scope.chartWidthMax = scope.height * 2;
            if(!scope.suffix) {
                scope.suffix = '';
            }

			scope.$watch('chartData', function() {

                if(!scope.chartData) {
                    return
                }

				var converters = COUNTRY;

				var countryLookup = {};

				for (var i = 0; i < converters.length; i++) {
					countryLookup[converters[i]['alpha-2']] = converters[i]['alpha-3'];
				}

				var finalData = {};

				for (var i = 0; i < scope.chartData.length; i++) {
					finalData[countryLookup[scope.chartData[i]['country']]] = scope.chartData[i];
				}

				for (var country in finalData) {
					var fill = '_' + Math.floor(finalData[country]['percentage'] * 100 / dataMaxVal(scope.chartData));
					finalData[country]['fillKey'] = fill;
				}

				var fills = {};

				var offset = 0.2;
				for (var i = 0; i < 101; i++) {
					var alpha = i * (1 - offset) / 100 + offset
					fills['_' + i] = 'rgba(' + scope.colourString + ',' + alpha + ')';
				}

				fills['defaultFill'] = 'rgba(200, 200, 200, 0.2)';

				var maxVal = dataMaxVal(scope.chartData);
				for (var country in finalData) {
					var fill = '_' + Math.floor(finalData[country]['value'] * 100 / maxVal);
					finalData[country]['fillKey'] = fill;
				}

				element.find('.vis-world-inner').html('');

				var drawChart = function() {
					scope.map = new Datamap({
						element: element.find('.vis-world-inner')[0],
						fills: fills,
						data: finalData,
						geographyConfig: {
							popupTemplate: function (geo, data) {

								var popupString = '<div class="hoverinfo"><strong>' + geo.properties.name + ': 0 ' + ' '+scope.suffix+' (0%)</strong></div>';

								if (data !== null) {
									popupString = [
										'<div class="hoverinfo"><strong>',
										geo.properties.name,
										': ' + data.value + ' '+scope.suffix+' (' + data.percentage + '%)',
										'</strong></div>'
									].join('');

                                    /* LEGEND */
                                    var dataval = data.value/maxVal*300;
                                    element.find('div.legend_tick').css('left',dataval);
                                    element.find('div.legend_tick').css('display','block');
								} else {
                                    element.find('div.legend_tick').css('display','none');
                                }

								return popupString;
							}
						}
					});
				};

                /* LEGEND */
                var legend = element.find('div.legend');
                var fullcolor = 'rgb('+scope.colourString+')';
                legend.css("background","-moz-linear-gradient(left, #ffffff 0%, "+fullcolor+" 100%)");
                legend.css("background","-webkit-linear-gradient(left, #ffffff 0%,"+fullcolor+" 100%)");
                legend.css("background","-ms-linear-gradient(left, #ffffff 0%,"+fullcolor+" 100%)");
                legend.css("background","linear-gradient(to right, #ffffff 0%,"+fullcolor+" 100%)");
                legend.css("filter","progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='"+fullcolor+"',GradientType=1 )");
                element.find('div.legend_max').text(maxVal);

                scope.resize = function() {
					scope.$apply(function() {
						scope.chartWidth = (element.parent().width());
						scope.chartWidthMax = scope.height * 2;
					});
					d3.select(element.find('.vis-world-inner')[0]).selectAll('svg').remove();
					d3.select(element.find('.vis-world-inner')[0]).selectAll('div').remove();
					drawChart();
                }

				window.addEventListener('resize', function(event){
                    clearTimeout(scope.resizetimeout);
                    scope.resizetimeout = setTimeout(scope.resize,100);
				});

                setTimeout(scope.resize,100);

			});
		}
	}
}]);