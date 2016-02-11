'use strict';

angular.module('convenienceApp')
  .factory('ModalService', function ($rootScope, $modal) {
    return {
      closeModal: function () {
        $rootScope.modalInstance.dismiss('cancel');
      },

      openModal: function () {
        $rootScope.modalInstance = $modal.open({
          templateUrl: 'auth.html',
          controller: 'AuthCtrl',
          size: 'sm'
        });
      },

      showContent : function(content) {
        if (content === 'login') {
          $rootScope.showLogin = true;
          $rootScope.showSignup = false;
          $rootScope.showForgotPassword = false;
          $rootScope.showResetPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'signup') {
          $rootScope.showSignup = true;
          $rootScope.showLogin = false;
          $rootScope.showForgotPassword = false;
          $rootScope.showResetPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'forgotPassword') {
          $rootScope.showForgotPassword = true;
          $rootScope.showSignup = false;
          $rootScope.showLogin = false;
          $rootScope.showResetPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'resetPassword') {
          $rootScope.showResetPassword = true;
          $rootScope.showSignup = false;
          $rootScope.showLogin = false;
          $rootScope.showForgotPassword = false;
          $rootScope.showVerifyEmail = false;
        } else if (content === 'verifyEmail') {
          $rootScope.showVerifyEmail = true;
          $rootScope.showResetPassword = false;
          $rootScope.showSignup = false;
          $rootScope.showLogin = false;
          $rootScope.showForgotPassword = false;
        }
      }
    };
  });

angular.module('convenienceApp').controller('AuthCtrl', function ($scope, ModalService, AuthService, $state, $rootScope, FlashService, $timeout, TrackerService) {
  $scope.showRole = AuthService.getIsParent();
  $scope.hideRole = true;
  $scope.user = {};
  $scope.error = null;
  $scope.log_in = 'Log in with Facebook';
  $scope.signup = 'Sign up with Facebook';
  $scope.modal = ModalService;

  $scope.destPath = function(value, isParent){
    AuthService.destPath(value, isParent);
    $scope.showRole = AuthService.getIsParent();
  };

  $scope.resetState = function() {
    $scope.user = {};
    $scope.submitted = false;
    $scope.error = null;
    if ($scope.forgotForm) {$scope.forgotForm.$setPristine();}
    if ($scope.resetForm) {$scope.resetForm.$setPristine();}
    if ($scope.form) {$scope.form.$setPristine();}
    if ($scope.loginForm) {$scope.loginForm.$setPristine();}
  };

  $scope.$watch('error', function () {
    $timeout(function () {
      $scope.error = null;
    }, 5000);
  });

  // LOGIN function
  $scope.login = function(form) {
    $scope.submitted = true;


    if(form.$valid) {
      var credentials = {
        rememberMe: $scope.user.loginRememberMe,
        email: $scope.user.email,
        password: $scope.user.password
      };
      var success = function() {
        // Logged in, redirect to home
        $scope.modal.closeModal();
        $state.go(AuthService.getDest());
        AuthService.setDest();

        //$rootScope.$emit('verify-email', {});


        //console.log('user' , AuthService.getCurrentUser());

        TrackerService.create('login success',{
          roleType : AuthService.getCurrentUser().roles[0] == 'user' ? 'Payer' : 'Payee'
        });
      };
      var error = function(err) {
        TrackerService.trackFormErrors('login error' , err.message);
        $scope.error = err.message;
        TrackerService.create('login error', {
          errorMessage : err.message,
          email : $scope.user.email
        });
      };
      AuthService.login(credentials, success, error);
    }
  };
  // END LOGIN function

  // SIGNUP function
  $scope.emailBtnClick = function(){
    $scope.hideRole = false;
    $scope.emailClick = $scope.emailClick ? false : true;
  };

  $scope.disabelSubmit = false;

  $scope.register = function(form) {

    $scope.submitted = true;
    if(form.$valid) {
      $scope.disabelSubmit = true;
      var user = {
        firstName: $scope.user.firstName,
        lastName: $scope.user.lastName
      };
      var credentials = {
        email: $scope.user.email,
        password: $scope.password,
        rememberMe: $scope.user.signupRememberMe
      };
      var success = function (data) {
        AuthService.addCredentials(data.userId, credentials, function() {
          // Account created, redirect to home
          $scope.modal.closeModal();
          //FlashService.addAlert({
          //  alias : 'verify-email',
          //  type:'warning',
          //  templateUrl: 'components/application/directives/alert/alerts/verify-email.html'
          //});

          //$scope.modal.showContent('verifyEmail');

          $state.go(AuthService.getDest());
          AuthService.setDest();

        }, error);
      };

      var error = function (err) {
        $scope.error = err.message;
        $scope.disabelSubmit = false;
        TrackerService.create('signup error' , {
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: $scope.user.email,
          errorMessage : err.message
        });
      };
      AuthService.createUser(user, success, error);
    }else{
      TrackerService.trackFormErrors('signup form', form);
    }
  };


  // END SIGNUP function

  // RESET function
  $scope.reset = function (form) {
    TrackerService.trackFormErrors('reset password form', form);
    $scope.submitted = true;
    if (form.$valid) {
      AuthService.resetPassword($rootScope.token, $scope.password, function(){
          delete $rootScope.token;
          $scope.modal.closeModal();
          TrackerService.create('reset password');
          $state.go('main');
          FlashService.addAlert({
            type: 'success',
            msg: 'Your password has been changed',
            timeout: 10000
          });
        },
        function(err){
          $scope.error = err.message;
          TrackerService.create('reset password error' , {
            errorMessage : err.message
          });
        });
    }
  };
  // END RESET function

  // FORTGOT function
  $scope.forgot = function (form) {
    $scope.submitted = true;
    if (form.$valid) {
      AuthService.forgotPassword($scope.user.email, function (data) {
        TrackerService.create('forgot', {
          email : $scope.user.email
        });
        if(data.message){
          $scope.message = true;
          //$scope.message = data.message;
        }else{
          $scope.sent = true;
          $scope.message = false;
        }
      });
    }
  };
  // END FORTGOT function
});
