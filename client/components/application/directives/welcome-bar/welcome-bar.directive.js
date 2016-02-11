'use strict';

angular.module('convenienceApp')
  .directive('welcomeBar', function () {
    return {
      templateUrl: 'components/application/directives/welcome-bar/welcome-bar.html',
      restrict: 'E',
      controller: 'WelcomeBarCtrl'
    };
  });