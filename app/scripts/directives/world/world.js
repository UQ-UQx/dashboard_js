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
			height: '=height'
		},

		templateUrl: 'scripts/directives/world/world.html',

		link: function(scope, element) {
			scope.chartWidth = (window.innerWidth - 240);
			scope.chartWidthMax = scope.height * 2;

			scope.$watch('chartData', function() {
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
				/*
				 scope.map = new Datamap({
				 element: element.find('.vis-world-container')[0],
				 fills: fills,
				 data: finalData,
				 geographyConfig: {
				 popupTemplate: function(geo, data) {
				 var popupString = '<div class="hoverinfo"><strong>' + geo.properties.name + ': 0 ' + ' posts (0%)</strong></div>';

				 if (data != null) {
				 popupString = ['<div class="hoverinfo"><strong>',
				 geo.properties.name,
				 ': ' + data.value + ' posts (' + data.percentage + '%)',
				 '</strong></div>'].join('');
				 }

				 return popupString;
				 }
				 }
				 }); */
                var maxVal = dataMaxVal(scope.chartData);
                for (var country in finalData) {
                    var fill = '_' + Math.floor(finalData[country]['value'] * 100 / maxVal);
                    finalData[country]['fillKey'] = fill;
                }
				//angular.element('vis-world-container').scope().height = 400;
				//	console.log(angular.element('vis-world-container').scope());
				//angular.element('vis-world-container').scope().$apply();

				//scope.$watch(scope.width, function () {
				//element.find('.vis-world-container').html('');
                element.find('.vis-world-inner').html('');
				var drawChart = function() {
					scope.map = new Datamap({
						element: element.find('.vis-world-inner')[0],
						fills: fills,
						data: finalData,
						geographyConfig: {
							popupTemplate: function (geo, data) {
								var popupString = '<div class="hoverinfo"><strong>' + geo.properties.name + ': 0 ' + ' posts (0%)</strong></div>';

								if (data != null) {
									popupString = [
										'<div class="hoverinfo"><strong>',
										geo.properties.name,
										': ' + data.value + ' posts (' + data.percentage + '%)',
										'</strong></div>'
									].join('');
								}

								return popupString;
							}
						}
					});
				};

				drawChart();

				window.addEventListener('resize', function(event){
					scope.$apply(function() {
						scope.chartWidth = (window.innerWidth - 240);
						scope.chartWidthMax = scope.height * 2;
					});
					d3.select(element.find('.vis-world-inner')[0]).selectAll('svg').remove();
					d3.select(element.find('.vis-world-inner')[0]).selectAll('div').remove();
					drawChart();
				});


				//console.log(chart.datamap);

				//console.log(blah);
			});

		/*
		

		var rawdata2 = [
			{%  for countrycode, postcount, usercount, percentage in country_post_enrol %}
				{country:'{{ countrycode }}', fillKey: 'Low', post: {{ postcount }}, enrolment: {{ usercount }},
					percentage: {{ percentage|floatformat }}},
			{% endfor %}
		];
		finaldata2 = {}
		for(var i= 0; i < rawdata2.length; i++) {
			finaldata2[countrylookup[rawdata2[i]['country']]] = rawdata2[i];
		}
		for(country in finaldata2) {
			var fill
			if (finaldata2[country]['post'] == 0 && finaldata2[country]['enrolment'] != 0) {
				fill = '_no';
			}
			else {
				fill = '_' + Math.floor(finaldata2[country]['percentage'] * 100 / {{ post_enrol_max }});
			}
			finaldata2[country]['fillKey'] = fill;
		}
		var fills2 = {};
		var colorstring2 = '255, 127, 127';
		var offset2 = 0.1;
		for( var i=0; i<101; i++) {
			var alpha = i * (1 - offset2) / 100 + offset2
			fills2['_' + i] = 'rgba(' + colorstring2 + ',' + alpha + ')';
		}
		fills2['defaultFill'] = 'rgba(200, 200, 200, 0.05)';
		fills2['_no'] = 'rgba(200, 200, 200, 0.3)';
		setTimeout(function() {
		var map2 = new Datamap({
			element: document.getElementById('container2'),
			fills: fills2,
			data: finaldata2,
			geographyConfig: {
				popupTemplate: function(geo, data) {
					popupString = '<div class='hoverinfo'><strong>' + geo.properties.name + ': 0 ' +
							' posts, 0 enrolments</strong></div>';
					if(data != null) {
						popupString = ['<div class='hoverinfo'><strong>' +
							geo.properties.name + ':',
							data.post + ' posts ',
							data.enrolment + ' enrolments ',
							data.percentage + '%(posts/enrolements)',
							'</strong></div>'].join('<br>');
					}
					return popupString;
				}
			}
		});
		},500); */
		}
	}
}]);