'use strict';

var express = require('express');
var controller = require('./contact.controller');
var authService = require('../../../../auth/auth.service');

var router = express.Router();

router.post('/create', authService.isAuthenticated(), controller.create);
// router.get('/list/:id', authService.isAuthenticated(), controller.list);
// router.get('/load/:id', authService.isAuthenticated(), controller.load);
// router.put('/update/:id', authService.isAuthenticated(), controller.update);
//router.delete('/delete/:id', authService.isAuthenticated(), controller.delete);

module.exports = router;