'use strict';

var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');

var transporter = nodemailer.createTransport(config.emailService);

exports.sendContactEmail = function(dataProvider, cb) {
  if(!isValidEmail(dataProvider.ownerEmail)){
    return cb('Email is not valid');
  };
  emailTemplates(config.emailTemplateRoot,function(err,template){
    if(err) return cb(err);
    var emailVars = config.emailVars;
    emailVars.email = dataProvider.ownerEmail;
    emailVars.ownerName = dataProvider.businessName;
    emailVars.teamName = dataProvider.teamName;
    emailVars.provider = dataProvider;
    template('commerce/provider',emailVars,function(err, html, text){
      if(err) return cb(err);
      var mailOptions = config.emailOptionsAlerts;
      mailOptions.to = config.emailContacts.admin;
      //mailOptions.to = config.emailContacts.admin;
      //mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = emailVars.prefix+'Message to ' + emailVars.companyName;
      mailOptions.baseUrl = emailVars.baseUrl;
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
