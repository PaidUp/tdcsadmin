'use strict';

angular.module('convenienceApp')
  .directive('navBar', function () {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'components/application/directives/nav-bar/nav-bar.html',
      controller: 'NavbarCtrl'
    };
  });