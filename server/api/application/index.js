'use strict';

var express = require('express');
var controller = require('./application.controller');
var config = require('../../config/environment');
var router = express.Router();
var auth = require('TDCore').authCoreService;

router.post('/contact', controller.contact);
router.get('/config', controller.config);
router.get('/cron', auth.isAuthenticatedServer(config.connections.me.token), controller.cron);
router.get('/cron/reminder/payments', auth.isAuthenticatedServer(config.connections.me.token), controller.cronReminderPayments);
router.get('/cron/retry/payments', auth.isAuthenticatedServer(config.connections.me.token), controller.cronRetryPayments);
router.get('/cron/order/complete', auth.isAuthenticatedServer(config.connections.me.token), controller.cronCompleteOrders);
router.get('/cron/reminder/verify/bank', auth.isAuthenticatedServer(config.connections.me.token), controller.cronReminderVerifyBank);

//router.use('/report', require('./report/index'));

module.exports = router;
