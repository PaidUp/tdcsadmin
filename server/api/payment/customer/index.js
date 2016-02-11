'use strict';

var express = require('express');
var router = express.Router();
var authService = require('../../auth/auth.service');
var controller = require('./customer.controller');

router.post('/update',authService.isAuthenticated(), controller.updateCustomer);

module.exports = router;