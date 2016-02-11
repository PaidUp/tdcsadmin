'use strict';

var express = require('express');
var controller = require('./loanApplication.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.use('/user', require('./user/index'));

router.post('/create', authService.isAuthenticated(), controller.create);//2, create user loan. /payment/loan/apply
router.post('/state', authService.isAuthenticated(), controller.state);//3 /payment/loan/signcontract - modal
router.post('/sign', authService.isAuthenticated(), controller.sign);//4 /payment/loan/signcontract
router.post('/payment', authService.isAuthenticated(), controller.payment);//5 /payment/loan/payment
router.post('/simulate', authService.isAuthenticated(), controller.simulate);//6 loanJs /payment/loan/payment
router.post('/contract', authService.isAuthenticated(), controller.getcontract);//6 loanJs /payment/loan/payment

//This line ever must be last. -> router.get('/:id', authService.isAuthenticated(), controller.verify);
router.get('/:id', authService.isAuthenticated(), controller.application);
module.exports = router;
