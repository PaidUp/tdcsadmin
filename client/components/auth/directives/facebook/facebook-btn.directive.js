'use strict';

angular.module('convenienceApp')
  .directive('facebookBtn', function () {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      templateUrl: 'components/auth/directives/facebook/facebook-btn.html',
      scope: {
        ngModel: '=ngModel'
      },
      controller: 'FacebookBtnCtrl'
    };
  });