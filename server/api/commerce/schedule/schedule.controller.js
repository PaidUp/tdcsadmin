'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var config = require('../../../config/environment');
//var mix = require('../../../config/mixpanel');
let paymentPlan = require('./schedule.service')();

exports.getSchedule = function (req, res) {
  commerceService.getSchedule(req.body.productId,
    req.body.price,
    req.body.isInFullPay,
    req.body.discount, function (err, data) {
    if (err) {
      return handleError(res, err);
    }

    return res.status(200).json(data);
  });
}

exports.paymentPlanList = function (req, res) {
  let filter = req.body

  paymentPlan.paymentPlanList(filter, function(err, paymentList) {
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({'paymentList':paymentList})
  });
}

exports.paymentPlanInfoFullByOrderId = function (req, res) {
  let filter = req.params.orderId
  paymentPlan.paymentPlanInfoFullByName(filter, true, function(err, paymentList) {
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({'paymentList':paymentList})
  });
}

exports.scheduleInformationUpdate = function(req , res){
  if(!req.body.entityId){
    return handleError(res, {name : 'ValidationError' , message : 'entityId is required'})
  }

  let param = {
    scheduleId:req.body.entityId,
    informationData:
      [{
        name : 'isCharged',
        value : req.body.isCharged,
      },{
        name : 'nextPaymentDue',
        value : req.body.nextPaymentDue,
      },{
        name : 'price',
        value : req.body.price,
      },{
        name : 'percent',
        value : req.body.percent,
      },{
        name : 'fee',
        value : req.body.fee,
      },{
        name : 'feePercent',
        value : req.body.feePercent,
      },{
        name : 'discountToFee',
        value : req.body.discountToFee,
      },{
        name : 'description',
        value : req.body.description,
      },{
        name : 'status',
        value : req.body.status,
      },{
        name : 'accountId',
        value : req.body.accountId,
      }
      ]
  }


  paymentPlan.scheduleInformationUpdate(param , function(err, data){
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({data})
  })
}

exports.scheduleInformationCreate = function(req , res){
  console.log('req.body',req.body);
  if(!req.body.paymentPlanId){
    return handleError(res, {name : 'ValidationError' , message : 'paymentPlanId is required'})
  }

  let param = {
    paymentPlanId:req.body.paymentPlanId,
    informationData:
      [{
        name : 'isCharged',
        value : false,
      },{
        name : 'nextPayment',
        value : req.body.nextPaymentDue,
      },{
        name : 'nextPaymentDue',
        value : req.body.nextPaymentDue,
      },{
        name : 'price',
        value : req.body.price,
      },{
        name : 'percent',
        value : 0,
      },{
        name : 'fee',
        value : req.body.fee,
      },{
        name : 'feePercent',
        value : 0,
      },{
        name : 'discountToFee',
        value : 0,
      },{
        name : 'description',
        value : req.body.description,
      },{
        name : 'accountId',
        value : req.body.accountId,
      }
      ]
  }


  paymentPlan.scheduleInformationCreate(param , function(err, data){
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json({data})
  })
}

function handleError(res, err) {
  console.log('err',err)
  console.log('err.name',err.name)
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError" || err.name === "Magento Error") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
