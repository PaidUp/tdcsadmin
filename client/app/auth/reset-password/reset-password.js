'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('auth-password-reset', {
        url: '/auth/password/reset?token',
        controller: 'ResetPasswordCtrl'
      });
  });