'use strict';

var fs = require('fs');
var config = require('../../config/environment');
var layoutHtml = fs.readFileSync(config.root + '/server/views/loan/contract/layout.ejs', 'utf8');
var contentHtml = fs.readFileSync(config.root + '/server/views/loan/contract/content.ejs', 'utf8');
var ejs = require('ejs');
var wkhtmltopdf = require('wkhtmltopdf');

function createHtmlContract(contractDetails, cb) {
  var html = ejs.render(contentHtml,contractDetails);
  return cb(html);
}

function createPdfContract(contractDetails, cb){

  var html = ejs.render(contentHtml,contractDetails);

  var options = config.loan.contract.htmlPdfOptions;
  var filename = options.directory + "loan-contract-" + contractDetails.contractData.platform.contractNo + ".pdf";

  wkhtmltopdf(html, { pageSize: 'letter', output: filename, footerRight:'[page]/[toPage]' }, function (code, signal) {
    return cb(code, filename);
  });
};

exports.createPdfContract = createPdfContract;
exports.createHtmlContract = createHtmlContract;
