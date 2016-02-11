'use strict';

angular.module('convenienceApp')
  .directive('password', function() {
      return {
        restrict: 'E',
        templateUrl: 'components/auth/directives/password/password.html',
        scope: {
          password: '=',
          confirm: '=',
          form: '=passwordForm'
        }
      };
    });