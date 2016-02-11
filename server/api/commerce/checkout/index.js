'use strict';

var express = require('express');
var controller = require('./checkout.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/place', authService.isAuthenticated(), controller.place);

module.exports = router;