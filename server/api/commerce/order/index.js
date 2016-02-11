'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./order.controller');

var router = express.Router();

router.get('/list', authService.isAuthenticated(), controller.listOrders);
//basic: without bank account
router.get('/basic/:orderId', authService.isAuthenticated(), controller.getOrderBasic);
router.get('/:orderId', authService.isAuthenticated(), controller.getOrder);

module.exports = router;
