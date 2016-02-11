'use strict';

angular.module('convenienceApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angulartics',
  'angulartics.mixpanel',
  'angulartics.google.analytics',
  'facebook',
  'angularNumberPicker',
  'ui.mask',
  'ngStorage',
  'ngIdle'
]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $analyticsProvider,
                    FacebookProvider, $uiViewScrollProvider, $provide, IdleProvider, KeepaliveProvider) {

  IdleProvider.idle(5);
  IdleProvider.timeout(5);
  KeepaliveProvider.interval(10);

    $analyticsProvider.virtualPageviews(false);
    $uiViewScrollProvider.useAnchorScroll();
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    FacebookProvider.init('717631811625048');
    $httpProvider.interceptors.push('authInterceptor');

    $httpProvider.defaults.cache = false;
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

  $provide.decorator('$exceptionHandler', ['$log', '$delegate','$injector',
    function($log, $delegate,$injector) {
      return function(exception, cause) {
        var trackerService = $injector.get('TrackerService');
        trackerService.create('exceptionHandler', {
          message : exception.message
        });
        $delegate(exception, cause);
      };
    }
  ]);
}).factory('authInterceptor', function ($rootScope, $q, SessionService, $location, FlashService) {

    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if (SessionService.getCurrentSession()) {
          config.headers.Authorization = 'Bearer ' + SessionService.getCurrentSession();
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          // due to circular dependency i can't add AuthService or CartService so
          // i need to make a logout event broadcast
          $rootScope.$emit('logout', {});
          $rootScope.$emit('bar-welcome', {
            left:{
              url: ''
            } ,
            right:{
              url: ''
            }
          });
          FlashService.addAlert({
            type:'warning',
            msg: 'Session has expired.',
            timeout: 10000
          });
          $location.path('/');
          // remove any state tokens
          return $q.reject(response);
        }else if(response.status === 503) {
          $location.path('/maintenance');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .factory('encryptService', [function() {
    return EncryptedLocalStorage;
  }])

  .run(function ($rootScope, $state, $stateParams, AuthService, $analytics, FlashService, $anchorScroll) {
    $anchorScroll.yOffset = 100;
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      //Mixpanel page tracker
      /*
      $analytics.pageTrack(next.url);
      var currentUserMp = AuthService.getCurrentUser();
      if(currentUserMp && currentUserMp._id){
        $analytics.setUsername(currentUserMp._id);
        currentUserMp.name = currentUserMp.firstName  +' '+ currentUserMp.lastName + ' ' +currentUserMp.email;
        delete currentUserMp.addresses;
        delete currentUserMp.contacts;
        delete currentUserMp.teams;
        delete currentUserMp.meta.TDPaymentId;
        delete currentUserMp.verify;
        delete currentUserMp.__v;
        delete currentUserMp.$promise;
        $analytics.setUserProperties(currentUserMp);
      }*/
      AuthService.isLoggedInAsync(function(loggedIn) {
        if (next.auth && !loggedIn) {
          $rootScope.$emit('logout', {});
          $rootScope.$emit('bar-welcome', {
            left:{
              url: ''
            },
            right:{
              url: ''
            }
          });
          $state.go('main');
          event.preventDefault();
        }
      });
    });

    /**
      this method was comment because have a bug in the redirect.
    */
    /*$rootScope.$on('$locationChangeSuccess', function(evt) {
      AuthService.isLoggedInAsync(function(loggedIn) {
        if(loggedIn && AuthService.getCurrentUser().roles && $state.current.data && $state.current.data.roles){
          var authorize = AuthService.authorize({'userRoles':AuthService.getCurrentUser().roles, 'pageDataRoles':$state.current.data.roles});
          if(!authorize){
            var newLocation = AuthService.reLocation(AuthService.getCurrentUser().roles, AuthService.getCurrentUser().meta.providerStatus);
            $state.go(newLocation);
            evt.preventDefault();
          }else{
            return true;
          }
        }else{
          return true;
        }
      });
    });*/

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      $state.previous = fromState;
      AuthService.isLoggedInAsync(function(loggedIn) {
        if (loggedIn) {




          if(loggedIn && AuthService.getCurrentUser().roles && $state.current.data && $state.current.data.roles){
            var authorize = AuthService.authorize({'userRoles':AuthService.getCurrentUser().roles, 'pageDataRoles':$state.current.data.roles});
            if(!authorize){
              var newLocation = AuthService.reLocation(AuthService.getCurrentUser().roles, AuthService.getCurrentUser().meta.providerStatus);
              $state.go(newLocation);
              event.preventDefault();
            }
          }
        }
      });
    });
  });
