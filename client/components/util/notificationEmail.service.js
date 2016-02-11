/**
 * Created by riclara on 7/28/15.
 */
'use strict'

angular.module('convenienceApp')
  .service('NotificationEmailService', function ($resource, $q) {

    var emailResource = $resource('/api/v1/notification/email', {}, {
      send: { method:'POST', isArray: false }
    });

    var NotificationEmailService = this;

    NotificationEmailService.sendNotificationEmail = function(subject, jsonMessage){
      emailResource.send({subject:subject, jsonMessage:jsonMessage});
    };

  });
