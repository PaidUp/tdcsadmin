'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('user-account', {
        url: '/user/account',
        templateUrl: 'app/user/account/account.html',
        controller: 'AccountCtrl',
        auth: true,
        data:{
          roles:['user', 'coach']
        }
      });
  });