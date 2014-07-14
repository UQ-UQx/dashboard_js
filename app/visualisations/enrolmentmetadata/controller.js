'use strict';

/**
 * @ngdoc function
 * @name dashboardJsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardJsApp
 */
angular.module('dashboardJsApp')
    .controller('Visualisation_enrolmentmetadata_Ctrl', ['$scope', 'requestService', function ($scope, requestService) {

//        requestService.async('http://localhost/testdata.php').then(function(d) {
//            $scope.data = d;
//        });
          $scope.data = {"total": 6117, "modes": {"audit": 1942, "verified": 33, "honor": 4142}, "modetypes": ["audit", "honor", "verified"], "gender": {"Male": 4753, "Other": 20, "Female": 495, "Unspecified": 849}, "age": {"12-15": 53, "19-22": 1632, "Less than 12": 22, "Unknown": 940, "23-25": 1097, "41-50": 281, "Over 50": 214, "26-30": 931, "16-18": 242, "31-40": 705}, "courses": {"Bioimg_101x": "UQx_BIOIMG101x_1T2014", "Sense_101x": "UQx_Sense101x_3T2014", "Tropic_101x": "UQx_TROPIC101x_1T2014", "default": "UQx_Think101x_1T2014", "Hypers_301x": "UQx_HYPERS301x_1T2014", "Write_101x": "UQx_Write101x_3T2014", "Crime_101x": "UQx_Crime101x_3T2014", "Think_101x": "UQx_Think101x_1T2014", "World_101x": "UQx_World101x_3T2014"}, "protected": false, "coursecode": "UQx/HYPERS301x/1T2014", "selectedcoursename": "Hypers_301x", "education": {"Masters": 991, "Middle school": 164, "Secondary school": 1738, "Associate": 153, "Unspecified": 902, "Bachelor": 1799, "Other": 144, "Primary school": 17, "Doctorate": 209}}
    console.log("HELLO ENROLMENT METADATA");
  }]);