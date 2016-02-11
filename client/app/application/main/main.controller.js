'use strict';

angular.module('convenienceApp')
  .controller('MainCtrl', function ($rootScope, $scope, $timeout, FlashService, AuthService, ContactService,
                                    ModalService, ModalFactory, $anchorScroll, $location, TrackerService, $state, $stateParams,
                                    $localStorage) {

    $rootScope.alerts = [];
    $scope.modalFactory = ModalFactory;
    $scope.modal = ModalService;
    $scope.$storage = $localStorage.$default({});

    $scope.setPnTeam = function(){
        var pnTeam = $stateParams.team;
        if(pnTeam){
          $scope.$storage.pnTeam = pnTeam;
        }

      //$rootScope.$emit('verify-email', {});
      $rootScope.$emit('verify-bank-account', {});
    };

    $scope.destPath = function(value, isParent){
      AuthService.destPath(value, isParent);
    };

    $scope.$on('event:alerts', function (overwrite) {
      var alert = FlashService.shift();

      var exist = false;
      angular.forEach($rootScope.alerts, function (value, idx) {
        if(value.templateUrl === alert.templateUrl || alert.alias === value.alias){
          exist = true;

          $rootScope.alerts[idx] = alert;
        }
      });
      if (!exist) {
        $rootScope.alerts.push(alert);
      }

      if (alert.timeout) {
        $timeout(function () {
          angular.forEach($rootScope.alerts, function (value, index) {
            if (value.templateUrl === alert.templateUrl || alert.alias === value.alias) {
              $scope.closeAlert(index);
              if(value.launch){
               value.launch();
              }
            }

          });
        }, alert.timeout);
      }

    });

    $rootScope.$on('logout', function () {
      $rootScope.alerts = [];
    });

    if(!navigator.cookieEnabled){
      console.log('Convenience select uses cookies. For using our services, you should enable cookies.')
      console.log('To find out more about cookies, including how to see what cookies have been set and how to block and delete cookies, please visit http://www.aboutcookies.org/.')
      FlashService.addAlert({
        type: 'info',
        msg: 'Convenience select uses cookies. To use our services, you must enable cookies.',
        timeout: 100000
      });
    }

    //$rootScope.$on('close-alerts', function () {
    //  $rootScope.alerts = [];
    //});

    $rootScope.$on('verify-email', function () {
      AuthService.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {
          var currentUser = AuthService.getCurrentUser();
          if (currentUser.verify && currentUser.verify.status !== 'verified') {
            FlashService.addAlert({
              alias : 'verify-email',
              type:'warning',
              templateUrl: 'components/application/directives/alert/alerts/verify-email.html'
            });
          }
          $scope.isCardVerify = true;
        }
      });
    });

    $scope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };
    $scope.resendEmail = function(){
      AuthService.isLoggedInAsync(function(loggedIn) {
        $scope.user = angular.extend({}, AuthService.getCurrentUser());
        AuthService.resendEmail($scope.user._id);
      });
    };

    $scope.showContactUsForm = false;

    $scope.togggleForm = function(){
      $scope.showContactUsForm = !$scope.showContactUsForm;
    };

    $scope.solution = [true,true,true];

    $scope.showSolution = function(pos, val){
      $scope.solution[pos] = val;
    };

    $scope.goTo = function(path,anchor) {
      $location.path(path);
      if(anchor){
        $location.hash(anchor);
        $anchorScroll();
      }else{
        $location.hash('');
      }
      TrackerService.pageTrack({anchor : anchor});
    };

    //$scope.toggleMenu = function(){
    //  $(".navbar-toggle").click();
    //};

    $scope.toggleMenu = function () {
      $timeout(function() {
        angular.element('.navbar-toggle').trigger('click');
      }, 1000);
    };

    AuthService.isLoggedInAsync(function (isLoggin) {
      if (isLoggin && $location.$$path === '/') {
        $location.path('/athletes/dashboard');
      }
      TrackerService.pageTrack();
    });
  });
