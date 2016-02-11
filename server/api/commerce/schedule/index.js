'use strict';

var express = require('express');
var authService = require('../../auth/auth.service');
var controller = require('./schedule.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/generate' , authService.isAuthenticated(), controller.getSchedule);
router.post('/list' , authService.isAuthenticated(), controller.paymentPlanList);
router.post('/information/update' , authService.isAuthenticated(),  controller.scheduleInformationUpdate);
router.post('/information/create' , authService.isAuthenticated() , controller.scheduleInformationCreate);
router.get('/info/full/:orderId' , authService.isAuthenticated() , controller.paymentPlanInfoFullByOrderId);

module.exports = router;
