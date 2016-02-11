'use strict';
var paymentService = require('../payment.service');

function verifyAmounts (amount, cb) {
	cb(amount && !isNaN(amount) && amount > 0);
}

exports.verifyAmounts = verifyAmounts;
