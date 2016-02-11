'use strict';

describe("Auth Controller", function() {

  beforeEach(module('convenienceApp'));
  beforeEach(module('app/main/main.html'));
  beforeEach(module('app/athletes/athletes.html'))

  var $scope;
  var httpBackend;
  var AuthCtrl;
  var $rootScope;
  var AuthService;
  var SessionService;
  var $state
  var userResponse = {
    userId: 'userId',
    firstName: 'firstName',
    lastName: 'lastName',
    birthDate: {},
    gender: 'gender',
    height: {},
    weight: {}
  };
  var form = {
    $valid: true
  };
  var userFormData = {
    firstName: 'example',
    lastName: 'exampleLastName',
    email: 'example@example.com',
    password: 'qwerty'
  };

  beforeEach(inject(function (_$rootScope_, $httpBackend, $controller, _$state_, _AuthService_, _SessionService_){
    AuthService = _AuthService_;
    SessionService = _SessionService_;
    $state = _$state_;
    $scope = _$rootScope_.$new();
    $rootScope = _$rootScope_;
    $rootScope.closeModal = function(){},
    $rootScope.modalInstance = {
        dismiss: function(){}
    };
    AuthCtrl = $controller('AuthCtrl', { $scope: $scope });
    httpBackend = $httpBackend;
    AuthService = _AuthService_;
    SessionService = _SessionService_;
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  // FORGOT PASSWORD
  describe("Forgot Password", function() {
    it("should send a forgot password request", function() {
      httpBackend.expectPOST('/api/v1/auth/password/reset-request').respond(200);
      $scope.user = {
        email: 'example@example.com'
      }
      $scope.forgot(form);
      expect($scope.submitted).toBeTruthy();
      httpBackend.flush();
    });
  });
  // END FORGOT PASSWORD

  // LOGIN
  describe("Login With Credentials", function() {
    it("should login successfully", function() {
      httpBackend.expectPOST('/api/v1/auth/local/login').respond({
        token: 'verylargetoken'
      });
      httpBackend.expectGET('/api/v1/user/current?token='+'verylargetoken').respond(userResponse);
      $scope.user = {
        email: "example@example.com",
        password: "qwerty"
      };
      $scope.login(form);
      expect($scope.submitted).toBeTruthy();
      httpBackend.flush();
      expect(SessionService.getCurrentSession()).toEqual('verylargetoken');
      expect(JSON.stringify($rootScope.currentUser)).toEqual(JSON.stringify(userResponse));
      expect($state.is('athletes')).toBeTruthy();
    });

    it("should fail when credentials already exist", function() {
      httpBackend.expectPOST('/api/v1/auth/local/login').respond(403, {
        code: 'AuthCredentialExists',
        message: 'You can not sign up as the specify user'
      });
      $scope.user = {
        email: "example@example.com",
        password: "qwerty"
      };
      $scope.login(form);
      httpBackend.flush();
      expect($scope.error).toEqual('You can not sign up as the specify user');
    });
  });
  // END LOGIN

  // RESET PASSWORD
  describe("Reset Password", function() {
    it("should send a reset password request with a token and a new password", function() {
      httpBackend.expectPOST('/api/v1/auth/password/reset').respond(200);
      $rootScope.token = 'Very Large Token';
      $scope.user = {
        email: 'example@example.com'
      }
      spyOn($rootScope, 'closeModal');
      $scope.reset(form);
      expect($scope.submitted).toBeTruthy();
      httpBackend.flush();
      // expect($rootScope.closeModal).toHaveBeenCalled();
    });
  });
  // END RESET PASSWORD

  // SIGNUP
  describe('Signup With Credentials', function() {
    it('should signup successfully', function() {
      httpBackend.expectPOST('/api/v1/user/create').respond({
        userId: 'VeryLargeUserId'
      });
      httpBackend.expectPOST('/api/v1/auth/local/signup').respond({
        token: 'VeryLargeToken'
      });
      httpBackend.expectGET('/api/v1/user/current?token='+'VeryLargeToken').respond(userResponse);
      $scope.user = userFormData;
      $scope.register(form);
      expect($scope.submitted).toBeTruthy();
      httpBackend.flush();
      expect(SessionService.getCurrentSession()).toEqual('VeryLargeToken');
      expect(JSON.stringify($rootScope.currentUser)).toEqual(JSON.stringify(userResponse));
      expect($state.is('athletes')).toBeTruthy();
    });

    it('should fail when user cannot signup(it has createdBy attribute)', function() {
      httpBackend.expectPOST('/api/v1/user/create').respond({
        userId: 'VeryLargeUserId'
      });
      httpBackend.expectPOST('/api/v1/auth/local/signup').respond(403, {
        code: 'AuthCredentialExists',
        message: 'You don\'t have permission for this operation'
      });
      $scope.user = userFormData
      $scope.register(form);
      httpBackend.flush();
      expect(SessionService.getCurrentSession()).not.toBeDefined();
      expect($rootScope.currentUser).not.toBeDefined();
      expect($scope.error).toEqual('You don\'t have permission for this operation');
    });

    it('should fails when there is an error creating user', function() {
      httpBackend.expectPOST('/api/v1/user/create').respond(400, {
        code: 'ValidationError',
        message: 'Field error description'
      });
      spyOn(AuthService, 'addCredentials');
      $scope.user = userFormData
      $scope.register(form);
      httpBackend.flush();
      expect(AuthService.addCredentials).not.toHaveBeenCalled();
      expect(SessionService.getCurrentSession()).not.toBeDefined();
      expect($rootScope.currentUser).not.toBeDefined();
      expect($scope.error).toEqual('Field error description');
    });

    it('should fails when user id doesn\'t exists', function() {
      httpBackend.expectPOST('/api/v1/user/create').respond({
        userId: 'VeryLargeUserId'
      });
      httpBackend.expectPOST('/api/v1/auth/local/signup').respond(404, {
        code: 'AuthCredentialNotExists',
        message: 'User id does not exists'
      });
      $scope.user = userFormData
      $scope.register(form);
      httpBackend.flush();
      expect(SessionService.getCurrentSession()).not.toBeDefined();
      expect($rootScope.currentUser).not.toBeDefined();
      expect($scope.error).toEqual('User id does not exists');
    });

    it('should fails when user with credentials already exists', function() {
      httpBackend.expectPOST('/api/v1/user/create').respond({
        userId: 'VeryLargeUserId'
      });
      httpBackend.expectPOST('/api/v1/auth/local/signup').respond(409, {
        code: 'AuthCredentialExists',
        message: 'Credential of user already exists'
      });
      $scope.user = userFormData
      $scope.register(form);
      httpBackend.flush();
      expect(SessionService.getCurrentSession()).not.toBeDefined();
      expect($rootScope.currentUser).not.toBeDefined();
      expect($scope.error).toEqual('Credential of user already exists');
    });
  });
  // END SIGNUP
});