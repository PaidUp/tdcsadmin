'use strict';

var _ = require('lodash');
var userService = require('./user.service');
//var mix = require('../../config/mixpanel');

exports.create = function(req, res) {
  //mix.panel.track("createUser", req.body);
  userService.create(req.body, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.current = function(req, res, next) {
  //mix.panel.track("currentUser", {});
  userService.current(req.query, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.update = function(req, res, next) {
  //mix.panel.track("updateUser", req.body);
  userService.update(req.body, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.find = function(req, res, next) {
  userService.find(req.body, function (err, data){
    //mix.panel.track("findUser", mix.mergeDataMixpanel(req.body, req.user._id));
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.sendWelcome = function(req, res, next) {
  // Disable temporarily because the user should not leave the CS page.
  // userService.sendEmailWelcome(req.body, function (err, data){
    // mix.panel.track("sendEmailWelcome", mix.mergeDataMixpanel(req.body, req.user._id));
    // if(err) res.status(402).json(err);
    res.status(200).json({data:'sendWelcome'});
  // });
};

exports.sendResetPassword = function(req, res, next) {
  userService.sendEmailResetPassword(req.body, function (err, data){
    // mix.panel.track("sendEmailResetPassword", mix.mergeDataMixpanel(req.body, req.user._id));
    if(err) res.status(402).json(err);
    res.status(200).json({data:'sendResetPassword'});
  });
};