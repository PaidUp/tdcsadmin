'use strict';

angular.module('convenienceApp')
  .directive('alerts', function () {
    return {
      templateUrl: 'components/application/directives/alert/alert.directive.html',
      restrict: 'E'
    };
  });