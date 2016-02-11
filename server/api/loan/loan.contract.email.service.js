'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var userLoanService = require('./application/user/user.service');
var moment = require('moment');
var loanService = require('./loan.service');
var contractService = require('./loan.contract.service');
var commerceService = require('../commerce/commerce.service');

var transporter = nodemailer.createTransport(config.emailService);
//2
function sendContractEmail (loanUser, loan, cb) {
  var emailVars = config.emailVars;
  var contractTemplate = setContractData(loanUser, loan);
  contractTemplate.contractData.isEmail = true;

  var userAddressLoan = contractTemplate.searchData.userAddressLoan;
  var userPhone = contractTemplate.searchData.userPhone;
  var userEmail = contractTemplate.searchData.userEmail;

  emailVars.name = loanUser[0].firstName;
  emailVars.userId = loanUser[0]._id;

  commerceService.orderLoad(loan.orderId, function (err, magentoOrder) {
    var team = 'Convenience Select';
    if(!err && magentoOrder){
      team = magentoOrder.products[0].productSku.replace(/_/g, ' ');
    }

    emailTemplates(config.emailTemplateRoot, function (err, template) {

      if (err) return cb(err);

      // crear PDF
      contractService.createPdfContract(contractTemplate, function (errPDF, contractPDF) {
        template('loan/application', emailVars, function (err, html, text) {
          if (err) return cb(err);

          var mailOptions = config.emailOptions;
          mailOptions.to = userEmail;
          mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

          mailOptions.html = html;
          mailOptions.subject = emailVars.prefix + 'Your Loan Documents – ' + team;

          mailOptions.attachments = [
            {
              filename: contractPDF,
              path: contractPDF
          }];
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return cb(err);
            } else {
              return cb(null, info);
            }
          });

        });

      });
    });
  });

};


function getContractHtml (loanUser, loan, cb) {

  var emailVars = config.emailVars;
  var contractTemplate = setContractData(loanUser, loan);
  contractTemplate.contractData.isEmail = false;

  contractService.createHtmlContract(contractTemplate, function(html){

    return cb(html);

  });

};

function setContractData (loanUser, loan) {
  // dinamic data for the email
  var contractTemplate = {};
  contractTemplate.searchData = {};
  var searchData = {};

  // find loan address
  var i;
  for (i = 0; i < loanUser[0].addresses.length; i++) {
    if (loanUser[0].addresses[i].type === 'loan') {
      contractTemplate.searchData.userAddressLoan = loanUser[0].addresses[i];
      break;
    }
  };

  // find loan phone number
  var i;
  for (i = 0; i < loanUser[0].contacts.length; i++) {
    if (loanUser[0].contacts[i].type === 'telephone') {
      contractTemplate.searchData.userPhone = loanUser[0].contacts[i].value;
      break;
    }
  };

  // find loan mail
  var i;
  for (i = 0; i < loanUser[0].contacts.length; i++) {
    if (loanUser[0].contacts[i].type === 'email') {
      contractTemplate.searchData.userEmail = loanUser[0].contacts[i].value;
      break;
    }
  };

  var last4snn = loanUser[0].ssn;
  var todayNow = new moment().format("MMMM DD, YYYY");

  contractTemplate.contractData = config.contractData;

  var i;
  for (i=0; i<loan.schedule.length; i++) {
    loan.schedule[i].paymentDay = new moment(loan.schedule[i].paymentDay).format("dddd, MMMM Do YYYY");
  };
  contractTemplate.contractData.platform = {
    date: todayNow,
    contractNo: loan.orderId,
    dateofNote: todayNow,
    annualPercentageRate: parseFloat(config.loan.defaults.interestRate).toFixed(2),
    financeCharge: parseFloat(loan.interestSum).toFixed(2),
    amountFinanced: parseFloat(loan.amount).toFixed(2),
    totalOfPayments: parseFloat(loan.sum).toFixed(2),
    numberOfPayments: loan.schedule.lenght,
    amountOfPayment: loan.schedule[0].installment,
    whenPaymentsAreDue: loan.schedule[0].paymentDay,
    installmentAccountHandlingCharge: parseFloat(loan.interestSum).toFixed(2),
    effectiveDate: todayNow,
    schedule: loan.schedule
  };

  contractTemplate.contractData.client = {
    borrower: loanUser[0].firstName + ', ' + loanUser[0].lastName,
    address: contractTemplate.searchData.userAddressLoan.address1,
    city: contractTemplate.searchData.userAddressLoan.city,
    state: contractTemplate.searchData.userAddressLoan.state,
    zip: contractTemplate.searchData.userAddressLoan.zipCode,
    phone: contractTemplate.searchData.userPhone,
    name: loanUser[0].firstName,
    lastName: loanUser[0].lastName,
    last4ssn: last4snn
  };
  return contractTemplate;

};


exports.getContractHtml = getContractHtml;
exports.sendContractEmail = sendContractEmail;
