/**
 * Created by riclara on 7/28/15.
 */
'use strict';

var config = require('../../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var transporter = nodemailer.createTransport(config.emailService);

exports.sendNotification = function (subject, jsonMessage, cb) {
  try{

    var email = config.emailContacts.admin;
    emailTemplates(config.emailTemplateRoot, function (err, template) {

      if (err) return cb(err);
      var emailVars = config.emailVars;
      var arrMsj = [];
      for(var key in jsonMessage){
        arrMsj.push(key+': '+jsonMessage[key]);
      }
      emailVars.arrMsj = arrMsj;
      template('notifications', emailVars, function (err, html, text) {
        if (err) return cb(err);
        var mailOptions = config.emailOptionsAlerts;
        mailOptions.html = html;
        mailOptions.to = email;
        //mailOptions.bcc = config.emailContacts.developer;
        mailOptions.subject = emailVars.prefix + subject + emailVars.companyName;
        mailOptions.attachments = [];
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return cb(error);
          } else {
            return cb(null, info);
          }
        });
        //return cb(err, null);
      });
    });

  }catch(e){
    return cb(e, null);
  }
};
