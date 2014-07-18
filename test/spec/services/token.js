'use strict';

describe('Service: Token', function () {

  // load the service's module
  beforeEach(module('dashboardJsApp'));

  // instantiate service
  var Token;
  beforeEach(inject(function (_Token_) {
    Token = _Token_;
  }));

  it('should do something', function () {
    expect(!!Token).toBe(true);
  });

});
