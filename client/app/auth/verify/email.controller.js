'use strict';

angular.module('convenienceApp')
  .controller('EmailCtrl', function ($scope, $stateParams, AuthService, $state, FlashService, $rootScope) {
    if ($stateParams.token) {
      AuthService.verifyEmailToken($stateParams.token, function(){
          AuthService.updateCurrentUserSync(function(user){
            $rootScope.currentUser = user;
            $state.go('athletes');
            FlashService.overrideByAlias('verify-email',{
              type: 'success',
              templateUrl:'components/application/directives/alert/alerts/verify-email-success.html',
              timeout: 10000
            });
          });
        },
        function(err){
          FlashService.addAlert({
            type: 'danger' ,
            msg: err.message,
            timeout: 10000
          });
          $state.go('athletes');
        });
    }
  });
