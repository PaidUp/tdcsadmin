'use strict';


var logger = require('../../config/logger');
var loan = require('./loan.model');
var config = require('../../config/environment');
//var commerceAdapter = require('../user/user.service');
//var commerceAdapter = require('../commerce/commerce.adapter');
var commerceService = require('../commerce/commerce.service');
var paymentService = require('../payment/payment.service');
var loanService = require('TDCore').loanService; //require('../payment/payment.service');
var userService = require('../user/user.service');
var paymentEmailService = require('../payment/payment.email.service');

var config = require('../../config/environment');
var tdLoanService = require('TDCore').loanService;
//var mix = require('../../config/mixpanel');

function simulate (dataSimulate, cb) {
  tdLoanService.init(config.connections.loan);
  tdLoanService.simulate(dataSimulate, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function save(loan, cb) {
  tdLoanService.init(config.connections.loan);
  tdLoanService.save(loan, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function findOne(filter, cb) {
  tdLoanService.init(config.connections.loan);
  tdLoanService.find(filter, function (err, data){
    if(err) return cb(err);
    return cb(null, data[0]);
  });
}

function create(dataCreate, cb) {
  tdLoanService.init(config.connections.loan);
  tdLoanService.create(dataCreate, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function find(filter, cb) {
  tdLoanService.init(config.connections.loan);
  tdLoanService.find(filter, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function captureLoanSchedule(loan, scheduledIndex, cb) {
  logger.log('info', 'Charging loan: ' + loan.id + ' scheduled payment: ' + (scheduledIndex + 1));
  var amount = loan.schedule[scheduledIndex].installment;
  // Get Magento Order
  commerceService.orderLoad(loan.orderId, function(err,order){
    userService.find({_id:order.userId}, function(err, user){
       paymentService.capture(order, user[0], order.products[0].TDPaymentId, amount, order.paymentMethod, function(captureErr, data){
         if (captureErr) {
           // Stop loan
           logger.log('info', 'Stopping loan: ' + loan.id);
           loan.state = 'delinquent';
           loan.schedule[scheduledIndex].state = 'failed';
           //loan.markModified('schedule');
           save(loan, function (err, dataLoan) {
             if(captureErr.name === 'not-bank-verified') {
               paymentEmailService.sendFinalEmail(user[0], amount, loan.orderId, function (error, data) {
                  //mix.panel.track("loanLoanScheduleSendFinalEmail", mix.mergeDataMixpanel(loan, user[0]._id));
                 logger.log('info', 'Send email capture failed. ');
                 return cb(err);
               });
             }else{//captureErr.name === 'not-available-payment'
               logger.info('loose... '+ captureErr.name);
               return cb(captureErr);
             }
           });
         }
         else {
           // All good, schedule captured
           loan.schedule[scheduledIndex].state = 'paid';
           //loan.markModified('schedule');
           save(loan, function (err, dataLoan) {
             paymentEmailService.sendProcessedEmail(user, amount, loan.orderId, function(err, data){
              //mix.panel.track("loanLoanScheduleSendProcessedEmail", mix.mergeDataMixpanel(loan, user[0]._id));
               logger.log('info', 'Send email capture processed. ');
             });
             return cb(err);
           });
           return cb(null, data);
         }
       });
     });
   });
 }

exports.simulate = simulate;
exports.save = save;
exports.findOne = findOne;
exports.find = find;
exports.create = create;
//exports.isValidNumberPayments = isValidNumberPayments;
// exports.isValidAmount = isValidAmount;
exports.captureLoanSchedule = captureLoanSchedule;
