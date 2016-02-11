'use strict';

var express = require('express');
var controller = require('./contact.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.post('/create', authService.isAuthenticated(), controller.create);
router.post('/list/:id', authService.isAuthenticated(), controller.list);
router.get('/load/:id/:contactId', authService.isAuthenticated(), controller.load);
router.put('/update/:id', authService.isAuthenticated(), controller.update);
//router.delete('/delete/:id', controller.delete);

module.exports = router;