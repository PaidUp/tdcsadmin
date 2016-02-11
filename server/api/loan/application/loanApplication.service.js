'use strict';

var aba = require('ABAValidator').ABAValidator;
var tdLoanApplicationService = require('TDCore').loanApplicationService;
var config = require('../../../config/environment');

function create (loanApplication, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.create(loanApplication, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function save (loanApplication, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.save(loanApplication, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function simulate (dataSimulate, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.simulate(dataSimulate, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function state (dataState, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.state(dataState, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function payment (dataPayment, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.payment(dataPayment, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function contract (dataContract, cb) {
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.contract(dataContract, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function findOne(applicationId, cb){
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.find(applicationId, function (err, data){
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function sign (data, cb){
  tdLoanApplicationService.init(config.connections.loan);
  tdLoanApplicationService.sign(data, function (err, data){
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

// function validateABA(abaNum) {
//   return aba.validate(abaNum);
// }

// function validateDDA(ddaNum) {
//   if(ddaNum.length < 4) {
//     return false;
//   }
//   return true;
// }

exports.create = create;
exports.save = save;
exports.simulate = simulate;
exports.state = state;
exports.contract = contract;
//exports.validateState = validateState;
exports.sign = sign;
exports.payment = payment;
//exports.isValidIncomeType = isValidIncomeType;
exports.findOne = findOne;
//exports.validateABA = validateABA;
//exports.validateDDA = validateDDA;
