'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./order.controller');

var router = express.Router();

router.get('/list', authService.isAuthenticated(), controller.listOrders);
//basic: without bank account
router.get('/basic/:orderId', authService.isAuthenticated(), controller.getOrderBasic);
router.get('/:orderId', authService.isAuthenticated(), controller.getOrder);
router.post('/search', authService.isAuthenticated(), controller.orderSearch);
router.post('/edit', authService.isAuthenticated(), controller.editOrder);
router.post('/add', authService.isAuthenticated(), controller.addPaymentPlan);

module.exports = router;
