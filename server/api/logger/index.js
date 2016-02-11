'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./logger.controller.js');
var authService = require('../auth/auth.service');

router.post('/put',  controller.logger);

module.exports = router;
