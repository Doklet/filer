'use strict';

describe('Service: pipeService', function () {

  // load the service's module
  beforeEach(module('filerApp'));

  // instantiate service
  var pipeService;
  beforeEach(inject(function (_pipeService_) {
    pipeService = _pipeService_;
  }));

  it('should do something', function () {
    expect(!!pipeService).toBe(true);
  });

});
