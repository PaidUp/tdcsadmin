'use strict';

angular.module('convenienceApp')
  .controller('WelcomeBarCtrl', function ($scope, $rootScope, AuthService) {
    $rootScope.$on('bar-welcome', function(event, args) {
        $scope.breadcrums = args.data || [];
        if(isLoggedIn() && isUser()){
           $scope.rightBar = args.right.url;
        }
        $scope.leftBar = args.left.url;
    });

    function isLoggedIn(){
      return AuthService.isLoggedIn();
    };

    function isUser(){
      return AuthService.isUser();
    };

  });