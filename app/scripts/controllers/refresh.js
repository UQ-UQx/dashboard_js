'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
  .controller('RefreshCtrl', ['$scope', 'RequestService', function ($scope, RequestService) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.endpoints = {};
    $scope.courses = [];
    $scope.refresh_list = [];
    $scope.running_current = 0;
    $scope.running_max = 5;
    $scope.running_mass = false;

    $scope.$watch('auth.isAuthenticated()', function() {
        if ($scope.auth.isAuthenticated()) {
            RequestService.async('/meta/courses/').then(function (data) {
                $scope.courses = data;
                RequestService.async('/endpointlist').then(function (endpointdata) {
                    for(var ep in endpointdata) {
                        var endpoint = endpointdata[ep];
                        var newness = 'old';
                        var date = moment(endpoint['lastcache']);
                        if(moment().diff(date, 'days') < 2) {
                            newness = 'new';
                        } else if(moment().diff(date, 'days') < 8) {
                            newness = 'medium';
                        }
                        $scope.endpoints[ep] = {url:endpoint['url'], status:endpoint['status'], refreshdate:endpoint['lastcache'], newness:newness};
                    }
                });
            });
        }
    });

    $scope.refresh = function (ep) {
        $scope.running_current += 1;
        var oldtime = $scope.endpoints[ep].refreshdate;
        var refreshURL = '/'+ep+'/?refreshcache=true';
        $scope.endpoints[ep].status = 'refresh fa-spin';
        RequestService.async(refreshURL).then(function (refreshURL) {
            RequestService.async('/endpointlist').then(function (endpointdata) {
                $scope.running_current -= 1;
                if(oldtime == endpointdata[ep]['lastcache']) {
                    $scope.endpoints[ep].status = 'times';
                    $scope.endpoints[ep].newness = 'old';
                } else {
                    $scope.endpoints[ep].status = 'check';
                    $scope.endpoints[ep].newness = 'new';
                }
                $scope.endpoints[ep].refreshdate = endpointdata[ep]['lastcache'];
            });
        });
        console.log(refreshURL);
    };

    $scope.refreshAll = function() {
        $scope.running_mass = true;
        for(var end in $scope.endpoints) {
            $scope.refresh_list.push(end);
        }
        $scope.refresh_list.sort();
        var jojo = setInterval(function() {
            if($scope.refresh_list.length == 0) {
                clearInterval(jojo);
                $scope.running_mass = false;
            }else if($scope.running_current < $scope.running_max) {
                $scope.refresh($scope.refresh_list[0]+"");
                $scope.refresh_list.shift();
            }
        },2000);
    }
  }]);