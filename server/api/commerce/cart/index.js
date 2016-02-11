'use strict';

var express = require('express');
var controller = require('./cart.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.get('/create', authService.isAuthenticated(), controller.create);
router.post('/add', authService.isAuthenticated(), controller.add);
router.get('/list/:id', authService.isAuthenticated(), controller.list);
router.post('/address', authService.isAuthenticated(), controller.address);
router.get('/view/:id', authService.isAuthenticated(), controller.view);
router.get('/totals/:id', authService.isAuthenticated(), controller.totals);
router.post('/coupon/add', authService.isAuthenticated(), controller.couponAdd);

module.exports = router;