'use strict';

var tdUserService = require('TDCore').userService;
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var transporter = nodemailer.createTransport(config.emailService);

function create (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.create(data, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function current (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.current(data.token, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function update (data, cb) {
  tdUserService.init(config.connections.user);
  var userId = data.parentId ? data.parentId : data.userId;

  tdUserService.update(data, userId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function find (filter, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.find(filter, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function save (data, cb) {
  tdUserService.init(config.connections.user);
  tdUserService.save(data, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

function sendEmailWelcome(data, cb) {
    emailTemplates(config.emailTemplateRoot,function(err,template){
        if(err) return cb(err);
        var emailVars = config.emailVars;
        emailVars.fullName = data.user.firstName + ' ' +data.user.lastName;//user.getFullName();
        emailVars.token = data.token;
        template('auth/welcome',emailVars,function(err, html, text){
            if(err) return cb(err);
            var mailOptions = config.emailOptionsAlerts;
            mailOptions.to = data.user.email;
            //mailOptions.bcc = config.emailContacts.developer;
            mailOptions.html = html;
            mailOptions.subject = emailVars.prefix + 'Welcome to ' + emailVars.companyName;
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


function sendEmailResetPassword(data, cb) {
  emailTemplates(config.emailTemplateRoot,function(err,template){
      if(err) return cb(err);
      var emailVars = config.emailVars;
      emailVars.fullName = data.user.firstName + ' ' +data.user.lastName;//user.getFullName();
      emailVars.token = data.token;
      template('auth/reset',emailVars,function(err, html, text){
          if(err) return cb(err);
          var mailOptions = config.emailOptionsAlerts;
          mailOptions.to = data.user.email;
          //mailOptions.bcc = config.emailContacts.developer;
          mailOptions.html = html;
          mailOptions.subject = emailVars.prefix + 'Reset Password ' + emailVars.companyName;
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

exports.create = create;
exports.current = current;
exports.update = update;
exports.find = find;
exports.save = save;
exports.sendEmailWelcome = sendEmailWelcome;
exports.sendEmailResetPassword = sendEmailResetPassword;
