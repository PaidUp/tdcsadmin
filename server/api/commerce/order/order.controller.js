'use strict';

var paymentService = require('../../payment/payment.service');
var userService = require('../../user/user.service');
var loanService = require('../../loan/loan.service');
var logger = require('../../../config/logger');
var userLoanService = require('../../loan/application/user/user.service');
var commerceService = require('../commerce.service');
var async = require('async');
//var mix = require('../../../config/mixpanel');

exports.listOrders = function (req, res) {
  var user = req.user;
  commerceService.getUserOrders(user, function (err, orders) {
    if (err) {
      return handleError(res, err);
    }
    async.eachSeries(orders, function (order, callback) {
      if (err) {
        callback(err);
      }
      userService.find({_id: order.athleteId}, function (err, athlete) {
        if (err) {
          callback(err);
        }
        order.athlete = athlete[0];
        callback();
      });
    }, function (err) {
      if (err) { return handleError(res, err); }
      //mix.panel.track("orderList", mix.mergeDataMixpanel(orders, req.user._id));
      return res.status(200).json(orders);
    });
  });
}

exports.getOrder = function(req , res){
  let user = req.user;
  if (!req.params.orderId) {
    return handleError(res, {name : 'ValidationError' , message : 'orderId is required' });
  }

  commerceService.getOrder(user, req.params.orderId, function(err1, data){
    if (err1) {
      return handleError(res, err1);
    }
    return res.status(200).json(data);
  });

}

exports.getOrderBasic = function(req , res){
  if (!req.params.orderId) {
    return handleError(res, {name : 'ValidationError' , message : 'orderId is required' });
  }

  commerceService.getOrderBasic(req.params.orderId, function(err1, data){
    if (err1) {
      return handleError(res, err1);
    }
    return res.status(200).json(data);
  });

}

exports.orderSearch = function(req , res){
  if (!req.body.params) {
    return handleError(res, {name : 'ValidationError' , message : 'params is required' });
  }

  commerceService.orderSearch(req.body.params, function(err, data){
    if (err) {
      return res.status(500).json({code : 'commerceService.orderSearch', message : JSON.stringify(err)});
    }
    return res.status(200).json(data);
  });

}

exports.editOrder = function(req , res){

  let user = req.user;
  if (!req.body.orderId) {
    return handleError(res, {name : 'ValidationError' , message : 'order id is required' });
  }
  if (!req.body.paymentPlanId) {
    return handleError(res, {name : 'ValidationError' , message : 'paymen plan id is required' });
  }
  req.body.userSysId = user._id;
  commerceService.editOrder(req.body, function(err, data){

    if (err) {
      return res.status(500).json({code : 'commerceService.editOrder', message : JSON.stringify(err)});
    }
    return res.status(200).json(data.body);
  });

}

exports.addPaymentPlan = function(req , res){
  let user = req.user;
  if (!req.body.orderId || !req.body.description || !req.body.dateCharge || !req.body.originalPrice ||
    !req.body.account) {
    return handleError(res, {name : 'ValidationError' , message : 'These params are required: description, dateCharge, originalPrice, account' });
  }

  req.body.userSysId = user._id;
  commerceService.addPaymentPlan(req.body, function(err, data){
    if (err) {
      return res.status(500).json({code : 'commerceService.addPaymenPlan', message : JSON.stringify(err)});
    }
    return res.status(200).json(data.body);
  });

}


function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('EEEE####', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
