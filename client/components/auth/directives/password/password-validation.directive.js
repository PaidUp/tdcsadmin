'use strict';

angular.module('convenienceApp')
  .directive('passwordValidation', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$parsers.unshift(function(viewValue){
          var validations = [
            //{
            //  pattern: /[a-z]+/,
            //  msg: 'lowerCase'
            //},
            //{
            //  pattern: /[A-Z]+/,
            //  msg: 'upperCase'
            //},
            //{
            //  pattern: /\d+/,
            //  msg: 'digits'
            //},
            //{
            //  pattern: /\W+/,
            //  msg: 'specialCharacter'
            //}
          ];
          var valid = true;
          angular.forEach(validations, function(validation){
            if (!validation.pattern.test(viewValue)) {
              valid = false;
              ctrl.$setValidity(validation.msg, false);
            } else {
              ctrl.$setValidity(validation.msg, true);
            }
          });
          if (viewValue.length < 6) {
            ctrl.$setValidity('minlength', false);
          } else {
            ctrl.$setValidity('minlength', true);
          }
          return valid ? viewValue : undefined;
        });
      }
    };
  });
