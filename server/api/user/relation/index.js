'use strict';

var express = require('express');
var controller = require('./relation.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/create', authService.isAuthenticated(), controller.create);
router.get('/list/:id', authService.isAuthenticated(), controller.list);

module.exports = router;