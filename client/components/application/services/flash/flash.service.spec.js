'use strict';

describe('Service: FlashService', function () {

  // load the service's module
  beforeEach(module('convenienceApp'));

  var FlashService;
  var $rootScope;

  beforeEach(inject(function (_$rootScope_, _FlashService_) {
    $rootScope = _$rootScope_;
    FlashService = _FlashService_;
    spyOn($rootScope, '$broadcast');
  }));

  it("should broadcast an alert event when we add an alert", function() {
    var alert = {type: 'danger', message: 'Danger Test'};
    FlashService.addAlert(alert);
    expect($rootScope.$broadcast).toHaveBeenCalledWith('event:alerts');
    expect(JSON.stringify(FlashService.shift())).toEqual(JSON.stringify(alert));
  });
});