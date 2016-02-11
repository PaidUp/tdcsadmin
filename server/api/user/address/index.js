'use strict';

var express = require('express');
var controller = require('./address.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/create', authService.isAuthenticated(), controller.create);
router.post('/list/:id', authService.isAuthenticated(), controller.list);
router.get('/load/:id/:addressId', authService.isAuthenticated(), controller.load);
router.put('/update/:id/:addressId', authService.isAuthenticated(), controller.update);
// router.delete('/delete/:id', controller.delete);

module.exports = router;