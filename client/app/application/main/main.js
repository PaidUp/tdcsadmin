'use strict';

angular.module('convenienceApp')
  .config(function ($stateProvider) {
    $stateProvider.state('main', {
      url: '/',
      templateUrl: 'app/application/main/main.html',
      test:'true',
      data:{
        roles:['guest']
      }
    }).state('maintenance', {
      url: '/maintenance',
      templateUrl: 'app/application/main/maintenance.html',
      controller : 'FaqCtrl'
    }).state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/application/dashboard/index.html',
      controller : 'DashboardCtrl'
    });
  });
