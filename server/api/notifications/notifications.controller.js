/**
 * Created by riclara on 7/28/15.
 */
'use strict';

var notificationsService = require('./notifications.service');
var logger = require('../../config/logger');

exports.sendEmailNotification = function(req, res){
  if(!req.body.subject){
    logger.error('param subject is required');
  }
  if(!req.body.jsonMessage){
    logger.error('param jsonMessage is required');
  }
  notificationsService.sendEmailNotification(req.body, function(err, data){
    if(err) {
      return res.status(500).json(err);
    } else {
      return res.status(200).json(data);
    }
  });
};
