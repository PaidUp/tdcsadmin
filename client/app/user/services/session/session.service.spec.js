'use strict';

describe('Service: sessionService', function () {

  // load the service's module
  beforeEach(module('convenienceApp'));

  var $cookieStore;
  var SessionService;

  beforeEach(inject(function(_$cookieStore_, _SessionService_){
    $cookieStore = _$cookieStore_;
    SessionService = _SessionService_;
    expect($cookieStore.get('token')).not.toBeDefined();
  }));

  afterEach(function() {
    SessionService.removeCurrentSession();
  });

  var user = {
    token: 'VeryLargeToken'
  }
  describe("Handling user session storage", function() {
    it("should save user token in cookies", function() {
      SessionService.addSession(user);
      expect($cookieStore.get('token')).toBeDefined();
      expect($cookieStore.get('token')).toEqual('VeryLargeToken');
    });

    it("should remove user token from cookies", function() {
      SessionService.addSession(user);
      expect($cookieStore.get('token')).toBeDefined();
      SessionService.removeCurrentSession();
      expect($cookieStore.get('token')).not.toBeDefined();
    });

    it("should retrieve current session", function() {
      SessionService.addSession(user);
      expect(SessionService.getCurrentSession()).toEqual('VeryLargeToken');
    });
  });
});