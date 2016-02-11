'use strict';

describe('Directive: facebookBtn', function () {

  // load the directive's module and view
  beforeEach(module('convenienceApp'));
  beforeEach(module('components/auth/facebook-directive/facebook-btn.html'));

  var FacebookBtnCtrl;
  var $scope;
  var AuthService;
  var $state;
  var Facebook;
  beforeEach(inject(function (_$rootScope_, $controller, _AuthService_, _$state_, _Facebook_) {
    $scope = _$rootScope_.$new();
    FacebookBtnCtrl = $controller('FacebookBtnCtrl', {$scope: $scope});
    AuthService = _AuthService_;
    $state = _$state_;
    Facebook = _Facebook_;
  }));

  describe("Successfull login with Facebook", function() {
    it("should call AuthService.loginFacebook", function() {
      spyOn(AuthService, 'loginFacebook');
      $scope.facebookLogin();
      expect(AuthService.loginFacebook).toHaveBeenCalled();
    });
  });
});