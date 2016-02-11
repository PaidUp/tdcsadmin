'use strict';

angular.module('convenienceApp')
  .controller('UserBarCtrl', function ($state, $scope, AuthService) {
    $scope.tabs = [
      {
        heading: 'Profile',
        state: 'user-account',
        active: $state.is('user-account'),
        role: 'user'
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
