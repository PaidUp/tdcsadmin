'use strict';

angular.module('convenienceApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, $state, AuthService) {

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
    $scope.isLoggedIn = function(){
      return AuthService.isLoggedIn();
    };

    $scope.isUser = function(){
      return AuthService.isUser();
    };

    $scope.isAdmin = function(){
      return AuthService.isAdmin();
    };


    $rootScope.$on('event:cart-state-changed', function (event, cart) {
      if (angular.isDefined(cart)) {
        $scope.itemCount = cart.items.length;
      } else {
        $scope.getCart();
      }
    });

    $scope.logout = function() {
      AuthService.logout();
      $rootScope.$emit('logout', {});
      $scope.itemCount = 0;
      $rootScope.$emit('bar-welcome', {
        left:{
          url: ''
        } ,
        right:{
          url: ''
        }
      });
      $state.go('main');
    };

    $scope.isActive = function(route) {
      return route === $state.path();
    };
  });
