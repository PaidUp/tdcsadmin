'use strict';

angular.module('convenienceApp')
  .directive('footerBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/directives/footer-bar/footer-bar.html'
    };
  });