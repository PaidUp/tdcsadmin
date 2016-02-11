'use strict';

angular.module('convenienceApp')
  .controller('AdminBarCtrl', function ($state, $scope, AuthService) {
    $scope.tabs = [
      {
        heading: 'Schedule',
        state: 'schedule-admin',
        active: $state.is('schedule-admin'),
        role: 'admin'
      }
    ];

    $scope.validate = function(role){
      return AuthService.validateRole(role);
    }

    $scope.$on('$stateChangeSuccess', function () {
      angular.forEach($scope.tabs, function(tab) {
        tab.active = $state.is(tab.state);
      });
    });
  });
