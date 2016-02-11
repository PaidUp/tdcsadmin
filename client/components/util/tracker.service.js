/**
 * Created by riclara on 7/28/15.
 */
'use strict'

angular.module('convenienceApp')
  .service('TrackerService', function ($analytics, AuthService, $location) {

    var TrackerService = this;


    TrackerService.trackFormErrors = function (event, form, details) {
      var user = AuthService.getCurrentUser();
      var obj = {formErrors : []}
      if(user){
        obj.email = user.email;
      }
      if(form.$error){
        angular.forEach(form.$error, function(value, key){
          var field = {};
          field[key] = [];
          angular.forEach(value, function(item){
            field[key].push(item.$name);
          });

          obj.formErrors.push(field)
        });
        if(details){
          angular.forEach(details, function(value, key){
            obj[key] = value;
          });
        }
        if(obj.formErrors.length){
          $analytics.eventTrack(event, obj);
        }
      }
    };

    TrackerService.create = function(event, details){
      var objDetails = {};

      if (!details && typeof details == 'string') {
        objDetails.messageError = details;
      }else if(details && (typeof details === 'object')){
        objDetails = details
      }
      var user = AuthService.getCurrentUser();
      if(user){
        objDetails.email = user.email;
      }
      $analytics.eventTrack(event, objDetails);
    }

    TrackerService.pageTrack = function(details){
      var user = AuthService.getCurrentUser();
      var objDetails = {};
      if(user){
        objDetails.email = user.email;
      }
      if(details){
        angular.forEach(details, function(value, key){
          objDetails[key] = value;
        });
      }
      objDetails.page = $location.path();
      $analytics.eventTrack('Page viewed', objDetails);
    };
  });
