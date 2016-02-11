'use strict';

var authService = require('./auth.service');
//var mix = require('../../config/mixpanel');

exports.logout = function(req, res, next) {
  authService.logout(req.query.token, function (err, data) {
    if(err) res.status(400).json(err);
    res.status(200).json(data);
  });
};

exports.verifyRequest = function(req, res, next) {
  //mix.panel.track("verifyRequest", {distinct_id:req.params.userId});
  authService.verifyRequest(req.params.userId, function (err, data) {
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.verify = function(req, res, next) {
  //mix.panel.track("verify", req.body);
  authService.verify(req.body, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.passwordResetRequest = function(req, res, next) {
  //mix.panel.track("passwordResetRequest", req.body);
  authService.passwordResetRequest(req.body, function (err, data) {
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.passwordReset = function(req, res, next) {
  //mix.panel.track("passwordReset", req.body);
  authService.passwordReset(req.body, function (err, data) {
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.emailUpdate = function(req, res, next) {
  //mix.panel.track("emailUpdate", req.body);
  authService.emailUpdate(req.body, req.params.userId, function (err, data) {
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.passwordUpdate = function(req, res, next) {
  //mix.panel.track("passwordUpdate", req.body);
  authService.passwordUpdate(req.body, req.params.userId, function (err, data) {
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.getSessionSalt = function(req, res, next) {
  authService.getSessionSalt(req.body.token, function (err, data) {
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};
