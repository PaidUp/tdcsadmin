'use strict';

describe('Controller: Email', function() {

  beforeEach(module('convenienceApp'));
  beforeEach(module('app/main/main.html'));
  beforeEach(module('app/athletes/athletes.html'))

  var $scope;
  var $rootScope;
  var $httpBackend;
  var AuthService;
  var EmailCtrl;
  var SessionService;
  var $state
  var FlashService;


  beforeEach(inject(function (_$rootScope_, _$httpBackend_, _AuthService_, $controller, _SessionService_, _$state_, _FlashService_){
    $scope = _$rootScope_.$new();
    EmailCtrl = $controller('EmailCtrl', {
      $scope: $scope,
      $stateParams: {
        token: 'very-large-token'
      }
    });
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    AuthService = _AuthService_;
    SessionService = _SessionService_;
    $state = _$state_;
    FlashService = _FlashService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it("should Verify Email Token", function() {
    $httpBackend.expectPOST('/api/v1/auth/verify').respond(200);
    $httpBackend.flush()
    expect($state.is('main')).toBeTruthy();
  });

  it("should Send Flash Alert on Error", function() {
    $httpBackend.expectPOST('/api/v1/auth/verify').respond(400, {
      "code": "ValidationError",
      "message": "Field error description"
    });
    $httpBackend.flush()
    var alert = FlashService.shift();
    expect(alert.type).toEqual('danger');
    expect(alert.msg).toEqual('Field error description');
  });
});