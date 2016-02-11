/**
 * Created by riclara on 7/28/15.
 */
'use strict';

var logger = require('./logger.service');

exports.logger = function(req, res){
  if(!req.body.type){
    logger.put('error','param type is required');
  }
  if(!req.body.message){
    logger.put('error','param message is required');
  }
  logger.put(req.body.type, req.body.message);
  return res.status(200).json(true);
};
