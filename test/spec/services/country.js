'use strict';

describe('Service: COUNTRY', function () {

  // load the service's module
  beforeEach(module('dashboardJsApp'));

  // instantiate service
  var COUNTRY;
  beforeEach(inject(function (_COUNTRY_) {
    COUNTRY = _COUNTRY_;
  }));

  it('should do something', function () {
    expect(!!COUNTRY).toBe(true);
  });

});
