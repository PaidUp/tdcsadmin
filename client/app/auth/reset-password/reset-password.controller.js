'use strict';

angular.module('convenienceApp')
.controller('ResetPasswordCtrl', function ($rootScope, $scope, $stateParams, $timeout, ModalService) {
    // $scope.$on('$stateChangeSuccess', function () {
    //   console.log($stateParams);
    //   console.log('broadcast');
    //   $rootScope.$broadcast('open-modal', {
    //     modal: 'resetPassword',
    //     token: $stateParams.token
    //   });
    // });
    $scope.modal = ModalService;
    $scope.$on('$viewContentLoaded', function () {
      $timeout(function () {
        if ($stateParams.token) {
          // console.log($stateParams);
          // console.log('broadcast');
          // $rootScope.$broadcast('open-modal', {
          //   modal: 'resetPassword',
          //   token: $stateParams.token
          // });
          $scope.modal.showContent('resetPassword');
          $scope.modal.openModal();
          $rootScope.token = $stateParams.token;
        }
      }, 1000);
    });
  });