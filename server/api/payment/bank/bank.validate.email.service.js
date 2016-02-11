'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var transporter = nodemailer.createTransport(config.emailService);

exports.sendValidateEmail = function  (userFirstName, email, accountLast4Digits, cb) {

  var emailVars = config.emailVars;

  emailVars.userFirstName = userFirstName;
  emailVars.accountLast4Digits = accountLast4Digits;

  emailTemplates(config.emailTemplateRoot, function (err, template) {

    if (err) return cb(err);

    template('payment/bank/validate', emailVars, function (err, html, text) {

      if (err) return cb(err);

      var mailOptions = config.emailOptions;
      mailOptions.to = email;
      //mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = emailVars.prefix + 'Contract ';

      mailOptions.attachments = [];

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(err);
        } else {
          return cb(null, info);
        }
      });

    });



  });
};
