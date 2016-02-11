'use strict';

var express = require('express');
var router = express.Router();

router.use('/bank', require('./bank/index'));
router.use('/card', require('./card/index'));
router.use('/customer', require('./customer/index'));
router.use('/webhook', require('./webhook/index'));

module.exports = router;
