'use strict';

var tdUserService = require('TDCore').userService;
var config = require('../../../config/environment');

function create(data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.relationCreate(data, function (err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
};

function list(userId, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.relationList(userId, function (err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
};

exports.create = create;
exports.list = list;