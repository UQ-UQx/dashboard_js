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

    $scope.$watch('auth.isAuthenticated()', function() {
        if ($scope.auth.isAuthenticated()) {
            RequestService.async('/meta/courses/').then(function (data) {
                $scope.courses = data;
                RequestService.async('/endpointlist').then(function (endpointdata) {
                    for(var ep in endpointdata) {
                        var endpoint = endpointdata[ep];
                        var newness = 'old';
                        var date = moment(endpoint['lastcache']);
                        if(moment().diff(date, 'days') < 7) {
                            newness = 'new';
                        } else if(moment().diff(date, 'days') < 28) {
                            newness = 'medium';
                        }
                        $scope.endpoints[ep] = {url:endpoint['url'], status:endpoint['status'], refreshdate:endpoint['lastcache'], newness:newness};
                    }
                });
            });
        }
    });

    $scope.refresh = function (ep) {
        console.log("ZING");
        var oldtime = $scope.endpoints[ep].refreshdate;
        var refreshURL = '/'+ep+'/?refreshcache=true';
        $scope.endpoints[ep].status = 'refresh fa-spin';
        RequestService.async(refreshURL).then(function (refreshURL) {
            RequestService.async('/endpointlist').then(function (endpointdata) {
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

  }]);