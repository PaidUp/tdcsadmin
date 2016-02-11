'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var loanApplicationSchema = new Schema({
  applicantUserId: String,
  incomeType: String,
  monthlyGrossIncome: String,
  creditScore: String,
  interestRate: String,
  state: String,
  meta: Array,
  amount: Number,
  numberPayments: Number,
  createAt: {type: Date, default: new Date()},
  updateAt: {type: Date, default: new Date()}
});

module.exports = mongoose.model('loanApplication', loanApplicationSchema, 'loanApplication');
