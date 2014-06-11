'use strict';

describe('Controller: VisualisationsMagicTestCtrl', function () {

  // load the controller's module
  beforeEach(module('dashboardJsApp'));

  var VisualisationsMagicTestCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    VisualisationsMagicTestCtrl = $controller('VisualisationsMagicTestCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
