'use strict';

describe("Service: UserService", function() {

  beforeEach(module('convenienceApp'));
  beforeEach(module('app/main/main.html'));

  var httpBackend;
  var UserService;


  beforeEach(inject(function ($httpBackend, _UserService_){
    httpBackend = $httpBackend;
    UserService = _UserService_;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe("User Actions", function() {

  });

  describe("User Contact Info Actions", function() {

  });

  describe("User Address Actions", function() {
    var address = {
      addressId: 'VeryLargeId',
      type: 'shipping',
      label: '',
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    };
    it("should be all promises", function() {
      httpBackend.expectPOST('/api/v1/user/address/create').respond(200);
      httpBackend.expectGET('/api/v1/user/address/list').respond(200);
      httpBackend.expectPUT('/api/v1/user/address/update/VeryLargeId').respond(200);
      httpBackend.expectDELETE('/api/v1/user/address/delete/VeryLargeId').respond(200);
      var create = UserService.createAddress(address);
      expect(typeof create.then).toEqual('function');
      var list = UserService.listAddresses();
      expect(typeof list.then).toEqual('function');
      var update = UserService.updateAddress(address.addressId, address);
      expect(typeof update.then).toEqual('function');
      var del = UserService.deleteAddress(address.addressId, address);
      expect(typeof del.then).toEqual('function');
      httpBackend.flush();
    });
  });
});