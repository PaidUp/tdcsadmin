'use strict';

var express = require('express');
var controller = require('./loan.controller');
var authService = require('../auth/auth.service');

var router = express.Router();

router.use('/application', require('./application/index'));

router.post('/simulate', controller.simulate);//1 loanJs /payment/loan
router.get('/find/loanId/:loanId', authService.isAuthenticated(), controller.getloan);//1 loanJs /payment/loan

module.exports = router;
