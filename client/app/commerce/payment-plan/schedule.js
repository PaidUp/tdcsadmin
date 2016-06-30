'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('schedule-admin', {
        url: '/commerce/paymentplan/schedule',
        templateUrl: 'app/commerce/payment-plan/schedule/search.html',
        controller: 'ScheduleCtrl',
        auth: true,
        data:{
          roles:['admin']
        }
      })
      .state('order-admin', {
      url: '/commerce/paymentplan/schedulev3',
      templateUrl: 'app/commerce/payment-plan/schedule/searchV3.html',
      controller: 'ScheduleV3Ctrl',
      auth: true,
      data:{
        roles:['admin']
      }
    });
  });
