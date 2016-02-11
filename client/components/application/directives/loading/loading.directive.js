'use strict';

angular.module('convenienceApp')
  .directive('loading', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/directives/loading/loading.html'
    };
  });