'use strict';

describe("Service: AuthService", function() {

  beforeEach(module('convenienceApp'));
  beforeEach(module('app/main/main.html'));

  var $scope;
  var $rootScope;
  var httpBackend;
  var AuthService;
  var SessionService;
  var UserService;


  beforeEach(inject(function (_$rootScope_, $httpBackend, $controller, _AuthService_, _SessionService_, _UserService_){
    $scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    httpBackend = $httpBackend;
    AuthService = _AuthService_;
    SessionService = _SessionService_;
    UserService = _UserService_;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe("Login", function() {
    var credentials = {
      email: "email@email.com",
      password: "qwerty",
      rememberMe: true
    };
    var userResponse = {
      userId: 'userId',
      firstName: 'firstName',
      lastName: 'lastName',
      birthDate: {},
      gender: 'gender',
      height: {},
      weight: {}
    };
    it("should login successfully", function() {
      httpBackend.expectPOST('/api/v1/auth/local/login').respond(200, {
        token: 'VeryLargeToken'
      });
      httpBackend.expectGET('/api/v1/user/current?token=VeryLargeToken').respond(200, userResponse);

      AuthService.login({
        email: 'email@email.com',
        password: 'qwerty'
      });
      httpBackend.flush();

      expect(SessionService.getCurrentSession()).toEqual('VeryLargeToken');
      expect(JSON.stringify($rootScope.currentUser)).toEqual(JSON.stringify(userResponse));
    });

    it("should not be logged id", function() {
      httpBackend.expectPOST('/api/v1/auth/local/login').respond(403, {
        'code': 'string',
        'message': 'You don\'t have permission for this operation'
      });
      spyOn(UserService, 'get');
      AuthService.login({
        email: 'email@email.com',
        password: 'qwerty'
      });
      httpBackend.flush();

      expect(UserService.get).not.toHaveBeenCalled();
      expect(SessionService.getCurrentSession()).toBeUndefined();
      expect($rootScope.currentUser).toBeUndefined();
    });
  });

  describe("Logout", function() {
    it("should remove current user", function() {
      AuthService.logout();
      expect(SessionService.getCurrentSession()).toBeUndefined();
      expect($rootScope.currentUser).toBeUndefined();
    });
  });

  describe("Login With Facebook", function() {

  });

  describe("Create User", function() {
    var user = {
      firstName: 'firstName',
      lastName: 'lastName'
    };
    it("should create a user successfully", function() {
      httpBackend.expectPOST('/api/v1/user/create').respond(200, {
        userId: 'VeryLargeUserId'
      });
      AuthService.createUser(user, function(data){
        expect(data.userId).toEqual('VeryLargeUserId');
      });
      httpBackend.flush();
    });
  });

  describe("Add Credentials", function() {
    var credentials = {
      email: 'email@email.com',
      password: 'qwerty',
      rememberMe: true
    };
    var userResponse = {
      userId: 'userId',
      firstName: 'firstName',
      lastName: 'lastName'
    };
    var server;
    beforeEach(function () {
      server = httpBackend.expectPOST('/api/v1/auth/local/signup');
    });

    it("should add credentials to an already created user", function() {
      server.respond(200, {token: 'VeryLargeToken'});
      httpBackend.expectGET('/api/v1/user/current?token=VeryLargeToken').respond(200, userResponse);
      AuthService.addCredentials('VeryLargeUserId', credentials, function (user){
        expect(JSON.stringify(user)).toEqual(JSON.stringify(userResponse));
      });

      httpBackend.flush();
      expect($rootScope.currentUser).toBeDefined();
      expect(SessionService.getCurrentSession()).toEqual('VeryLargeToken');
    });

    it("should handle errors when creating users", function() {
      server.respond(409, {
        code: 'AuthCredentialExists',
        message: 'Credential of user already exists'
      });
      AuthService.addCredentials('VeryLargeUserId', credentials,
        function (user){},
        function (err){
          expect(err.code).toEqual('AuthCredentialExists');
          expect(err.message).toEqual('Credential of user already exists');
        }
      );
      httpBackend.flush();
      expect($rootScope.currentUser).toBeUndefined();
      expect(SessionService.getCurrentSession()).toBeUndefined();
    });
  });

  describe("Forgot Password", function() {

  });

  describe("Reset Password", function() {

  });

  describe("Verify Email Token", function() {

  });
});