'use strict';

angular.module('convenienceApp')
  .directive('iealert', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/directives/IEAlert/ie-alert.html'
    };
  });
