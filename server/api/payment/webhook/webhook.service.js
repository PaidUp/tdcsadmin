'use strict';
var config = require('../../../config/environment/index');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var transporter = nodemailer.createTransport(config.emailService);

exports.sendEmail = function(data, title, cb) {
    emailTemplates(config.emailTemplateRoot,function(err,template){
        if(err) return cb(err);
        var emailVars = config.emailVars;
        emailVars.subject = emailVars.prefix + "Stripe webhook";
        emailVars.content = JSON.stringify(data) || "no data";
        template('payment/webhook',emailVars,function(err, html, text){
            if(err) return cb(err);
            var mailOptions = config.emailOptionsAlerts;
            mailOptions.to = config.emailContacts.admin;
            //mailOptions.bcc = config.emailContacts.developer;
            mailOptions.html = html;
            mailOptions.subject = emailVars.prefix + title +' Stripe webhook ' + emailVars.companyName;
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
