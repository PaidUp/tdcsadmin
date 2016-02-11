'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('auth-verify-email', {
        url: '/auth/verify/email?token',
        templateUrl: 'app/auth/verify/email.html',
        controller: 'EmailCtrl'
      });
  });