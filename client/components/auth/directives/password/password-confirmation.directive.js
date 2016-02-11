'use strict';

angular.module('convenienceApp')
  .directive('confirmPassword', function() {
      return {
        require: 'ngModel',
        restrict: 'A',
        link: function(scope, element, attributes, ctrl) {
          ctrl.$parsers.unshift(function (viewValue) {
            var match = (viewValue === scope.passwordForm.password.$viewValue);
            ctrl.$setValidity('match', match);
            return match ? viewValue : undefined;
          });
        }
      };
    });