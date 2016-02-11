'use strict';

angular.module('convenienceApp')
  .controller('FacebookBtnCtrl', function ($scope, $rootScope, FlashService, AuthService, $state, ModalService, TrackerService) {
    $scope.modal = ModalService;
    $scope.facebookLogin = function() {
      var success = function(user) {
        var roleType = AuthService.getIsParent() ? 'Payer' : 'Payee'
        TrackerService.create('Login Facebook', {roleType : roleType});
        $scope.modal.closeModal();
        $state.go(AuthService.getDest());
        AuthService.setDest();
      };
      var error = function(err) {
        console.log(err);
      };
      AuthService.loginFacebook(success, error);
    };
  });
