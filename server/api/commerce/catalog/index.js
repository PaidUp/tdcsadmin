'use strict';

var express = require('express');
var controller = require('./catalog.controller');
var authService = require('../../auth/auth.service');

var router = express.Router();

router.get('/category/:categoryId', authService.isAuthenticated(), controller.list);
router.get('/grouped/product/:productId', authService.isAuthenticated(), controller.groupedProducts);
router.get('/product/:productId', authService.isAuthenticated(), controller.catalogInfo);

module.exports = router;
