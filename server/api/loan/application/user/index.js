'use strict';

var express = require('express');
var controller = require('./user.controller');
var authService = require('../../../auth/auth.service');

var router = express.Router();

router.use('/address', require('./address/index'));
router.use('/contact', require('./contact/index'));

router.post('/create', authService.isAuthenticated(), controller.create);

router.post('/', authService.isAuthenticated(), controller.getUser);
//router.get('/:id', authService.isAuthenticated(), controller.getUser);
module.exports = router;