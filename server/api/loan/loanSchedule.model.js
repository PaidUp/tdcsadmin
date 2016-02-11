'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;


var loanSchedule = new Schema({
	paymentDay : Date,
    interestSum : Number,
    remain : Number,
    installment : Number,
    intrest : Number,
    capital : Number,
    state : String

});

module.exports = mongoose.model('loanSchedule', loanSchema, 'loanSchedule');