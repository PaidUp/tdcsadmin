'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;


var loanSchema = new Schema({
  applicationId: String,
//	creditorId: Number,
	amount: Number,
	interestSum: Number,
	capitalSum: Number,
	sum: Number,
	interestRate: Number,
//	ISOCurrencyCode: String,
//	loanTermInMonths: Number,
	loanIssueDate: {type: Date, default: new Date()},
//	loanMaturityDate: Date,
//	financeCharge: Number,
  orderId : String,
	schedule: Array,
	state: String,
	createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()},
  notifications: Array
});

module.exports = mongoose.model('loan', loanSchema, 'loan');
