'use strict';

var config = require('../../../../config/environment');
var Blind = require('blind');
var tdUserService = require('TDCore').userService;

function create (user, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.create(user, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function findOne(filter, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.find(filter, function (err, data) {
    if(err) {return cb(err);}
    return cb(null, data);
  });
}

function sign (user, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.sign(user, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.create = create;
exports.findOne = findOne;
exports.sign = sign;