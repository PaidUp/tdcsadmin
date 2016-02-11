'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./notifications.controller');
var authService = require('../auth/auth.service');

router.post('/email', authService.isAuthenticated(), controller.sendEmailNotification);


module.exports = router;
