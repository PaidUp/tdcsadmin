'use strict';

angular.module('convenienceApp')
  .filter('cleaner', function () {
    return function (input) {
      if (!input) { return; }
      return input.replace(/(-|\_)+/g, ' ');
    };
  });