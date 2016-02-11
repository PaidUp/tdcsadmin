'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var async = require('async');

var fs = require('fs');
var config = require('../../../config/environment');
var wkhtmltopdf = require('wkhtmltopdf');
//var mix = require('../../../config/mixpanel');

exports.listTransactions = function (req, res) {
  var user = req.user;
  commerceService.getUsertransactions(user, function (err, transactions) {
    if (err) {
      return handleError(res, err);
    }
    //mix.panel.track("transactionList", mix.mergeDataMixpanel(transactions, req.user._id));
    return res.status(200).json(transactions);
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}

exports.generatePDF = function (req, res) {
  var html = req.html;
  wkhtmltopdf(html, { pageSize: 'letter', output: filename, footerRight:'[page]/[toPage]' }, function (code, signal) {
    return cb(code, filename);
  });
}
