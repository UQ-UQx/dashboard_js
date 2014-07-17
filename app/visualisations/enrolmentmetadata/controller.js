'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('Visualisation_enrolmentmetadata_Ctrl', ['$scope', 'RequestService', function ($scope, RequestService) {
        $scope.age = [
            {label: "Less than 12", value: 22, comment: "Comment here"},
            {label: "12-15", value: 53},
            {label: "16-18", value: 242},
            {label: "19-22", value: 1632},
            {label: "23-25", value: 1097},
            {label: "26-30", value: 931},
            {label: "31-40", value: 705},
            {label: "41-50", value: 281},
            {label: "Over 50", value: 214},
            {label: "Unknown", value: 940},
        ];

        $scope.gender = [
            {label: "Male", value: 4753},
            {label: "Female", value: 495},
            {label: "Other", value: 20},
            {label: "Unspecified", value: 849},
        ];


        $scope.education = [
            {label: "Primary school", value: 17},
            {label: "Middle school", value: 164},
            {label: "Secondary school", value: 1738},
            {label: "Associate", value: 153},
            {label: "Bachelor", value: 1799},
            {label: "Master", value: 991},
            {label: "Doctorate", value: 209},
            {label: "Unspecified", value: 902},
        ];

        $scope.modes = [
            {label: "audit", value: 1942},
            {label: "honor", value: 4142},
            {label: "verified", value: 33},
        ];
  }]);