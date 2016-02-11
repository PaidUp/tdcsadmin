'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var transporter = nodemailer.createTransport(config.emailService);

exports.sendContactEmail = function(dataContact, cb) {

  if(!isValidEmail(dataContact.email)){
    return cb('Email is not valid');
  };

  emailTemplates(config.emailTemplateRoot,function(err,template){
    if(err) return cb(err);
    var emailVars = config.emailVars;
    emailVars.email = dataContact.email;
    emailVars.subject = emailVars.prefix + dataContact.subject;
    emailVars.content = dataContact.content;
    template('application/contact',emailVars,function(err, html, text){
      if(err) return cb(err);
      var mailOptions = config.emailOptions;
      mailOptions.to = config.emailContacts.contact;
      //mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = 'Message to ' + emailVars.companyName;
      mailOptions.attachments = [];
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
          return cb(error);
        }else{
          return cb(null, info);
        }
      });
    });
  });
};

function isValidEmail(mail)
{
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
}
