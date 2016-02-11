'use strict';

var express = require('express');
var tdAuthService = require('TDCore').authService;
var config = require('../../../config/environment');
//var mix = require('../../../config/mixpanel');

var router = express.Router();

router.post('/signup', function(req, res, next) {
	tdAuthService.init(config.connections.user);
  tdAuthService.signup(req.body, function (err, data){
  	if(err) res.status(402).json(err);
    //mix.panel.track("signup", req.body);
    res.status(200).json(data);
  });
});

router.post('/login', function(req, res, next) {
  tdAuthService.init(config.connections.user);
  tdAuthService.login(req.body, function (err, data){
  	if(err) res.status(402).json(err);
    //mix.panel.track("login", req.body);
    res.status(200).json(data);
  });
});

module.exports = router;
