'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./transaction.controller');

var router = express.Router();

router.get('/list', authService.isAuthenticated(), controller.listTransactions);

module.exports = router;
