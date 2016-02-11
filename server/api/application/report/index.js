'use strict';

var express = require('express');
var controller = require('./report.controller');
//var authService = require('../auth/auth.service');

var router = express.Router();

router.get('/parentsBuy', controller.parentsBuy);

module.exports = router;