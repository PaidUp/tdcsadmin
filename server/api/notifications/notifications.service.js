/**
 * Created by riclara on 7/28/15.
 */
'use strict';
var logger = require('../../config/logger');

var emailNotifications = require('../../components/util/notifications/email-notifications');

exports.sendEmailNotification = function(params, cb){
  emailNotifications.sendNotification(params.subject, params.jsonMessage, function(err, data){
    if(err){
      cb(err);
    }else{
      cb(null, data);
    }
  });
};
