'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('../../config/environment');
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var loanService = require('../loan/loan.service');
var loanApplicationService = require('../loan/application/loanApplication.service');
var paymentService = require('./payment.service');
var moment = require('moment');
var commerceService = require('../commerce/commerce.service');
var userService = require('../user/user.service');

var transporter = nodemailer.createTransport(config.emailService);
//Done
exports.sendNewOrderEmail = function (orderId, email, paymentMethod, account, amount, schedules, item, teamName, cb) {
  emailTemplates(config.emailTemplateRoot, function (err, template) {//TODO account.status, account.last4
    if (err) return cb(err);
    var emailVars = JSON.parse(JSON.stringify(config.emailVars));
    emailVars.orderId = orderId;
    emailVars.paymentMethod = paymentMethod;
    emailVars.last4Digits = account.last4;
    emailVars.amount = amount;
    emailVars.organizationName = item.name
    emailVars.product = teamName || item.sku;
    emailVars.schedules = schedules
    emailVars.accountStatus = account.status
    template('payment/checkout', emailVars, function (err, html, text) {
      if (err) return cb(err);
      var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
      mailOptions.html = html;
      mailOptions.to = email;
      //mailOptions.bcc = config.emailContacts.developer;
      mailOptions.subject = emailVars.prefix + 'New Order from ' + emailVars.companyName;
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
};
//Deprecated (loan)
exports.sendRemindToAddPaymentMethod = function (applicationId, orderId, cb) {
  var filter = {_id:applicationId};
  loanApplicationService.findOne(applicationId, function(err, applicationData){
    var userId = applicationData.applicantUserId;
    // get the user data with the userId
    var filter = {_id: userId};

    userService.find(filter, function (err, user) {
      if (err) return cb(err);
      if (!user[0]) return cb(false);

      var userFirstName = user[0].firstName;
      var userEmail = user[0].email;

      getNameTeamFromOrder(orderId, function(err,team){

        emailTemplates(config.emailTemplateRoot, function (err, template) {

          if (err) return cb(err);

          var emailVars = JSON.parse(JSON.stringify(config.emailVars));
          emailVars.userFirstName = userFirstName;

          template('payment/remindPaymentMethod', emailVars, function (err, html, text) {

            if (err) return cb(err);

            var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));

            mailOptions.html = html;
            mailOptions.to = userEmail;
            //mailOptions.bcc = config.emailContacts.developer;
            mailOptions.subject = emailVars.prefix + 'Oops…You Forgot To Add Your Bank Account - ' + team;

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
      });

    });

  });
};
//Deprecated (loan) CS-636
exports.sendRemindToVerifyAccount = function (orderId, user, account, date, cb) {
  var userAccountNumber = account.last4;
  var userEmail  = user.email;
  var userFirstName = user.firstName;
  var date = date || new Date();
  //TODO
  //var filter = {_id:applicationId};
  //loanApplicationService.findOne(applicationId, function(err, applicationData){
    //var userId = applicationData.applicantUserId;
    // get the user data with the userId
    //var filter = {_id: userId};
    //userService.find(filter, function (err, user) {
      //if (err) return cb(err);
      //if (!user) return cb(false);
      getNameTeamFromOrder(orderId, function(err,team){
        //paymentService.getUserDefaultBankId(user[0], function (err, bankId) {
          //paymentService.fetchBank(bankId, function (errTemplate, account) {
            //if (errTemplate) return cb(errTemplate);
            emailTemplates(config.emailTemplateRoot, function (err, template) {
              var emailVars = JSON.parse(JSON.stringify(config.emailVars));
              emailVars.userFirstName = userFirstName;
              emailVars.userAccountNumber = userAccountNumber;
              emailVars.month = date.getMonth() + 1;
              emailVars.day = date.getDate();
              emailVars.year = date.getFullYear();
              template('payment/remindToVerifyAccount', emailVars, function (err, html, text) {
                if (err) return cb(err);
                var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
                mailOptions.html = html;
                mailOptions.to = userEmail;
                //mailOptions.bcc = config.emailContacts.developer;//
                mailOptions.subject = 'Reminder: '+team+' - Confirm Your Bank Account';
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
          //});
        //});
      });
    //});
  //});
};
//Deprecated (loan)
exports.sendTomorrowChargeLoan = function (requestObject, cb) {

  //  var requestObject = {
  //    loan: '',
  //    schedule: ''
  //  };

  //var filter = {_id:requestObject.loan.applicationId};
  loanApplicationService.findOne(requestObject.loan.applicationId, function(err, applicationData){

    var userId = applicationData.applicantUserId;

    // get the user data with the userId
    var filter = {_id: userId};

    userService.find(filter, function (err, user) {
      if (err) return cb(err);
      if (!user[0]) return cb(false);

      var userEmail;
      var schedule = requestObject.schedule;
      var accountNumber;
      var bankId;
      var userFirstName = user[0].firstName;

      // find email in contacts to set the send to var
      userEmail = user[0].email;

      getNameTeamFromOrder(requestObject.orderId, function(err,team){
      paymentService.getUserDefaultBankId(user[0], function (err, bankId) {


          if (err === null) {

            paymentService.fetchBank(bankId, function (response, account) {
              accountNumber = account.bankAccounts[0].accountNumber;
              emailTemplates(config.emailTemplateRoot, function (errTemplate, template) {

                if (errTemplate) return cb(errTemplate);

                var emailVars = JSON.parse(JSON.stringify(config.emailVars));
                emailVars.userFirstName = userFirstName;
                emailVars.accountNumber = accountNumber;
                emailVars.amount = parseFloat(schedule.installment).toFixed(2);
                emailVars.datePaymentDue = new moment(schedule.paymentDay).format("dddd, MMMM Do YYYY");

                template('payment/tomorrowChargeLoan', emailVars, function (err, html, text) {
                  if (err) return cb(err);
                  var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
                  mailOptions.html = html;
                  mailOptions.to = userEmail;
                  //mailOptions.bcc = config.emailContacts.developer;
                  mailOptions.subject = 'Reminder: Your Account Will Be Debited in '+ requestObject.days +' Days – ' + team;

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
            });

          }
        });
      });

    });
  });
};
//TODO //deprecated please to see: sendFinalEmail
exports.sendFinalEmailCreditCard = function  (user, amount, order, cb) {
  var emailVars = JSON.parse(JSON.stringify(config.emailVars));
  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);;
  paymentService.fetchCard(user.meta.TDPaymentId, order.cardId, function (response, account) {
    if(!account) account = {}
    emailVars.accountLast4Digits = account.last4 || 'XXXX';
    commerceService.orderLoad(order.incrementId, function (err, magentoOrder) {
      emailTemplates(config.emailTemplateRoot, function (err, template) {
        if (err) return cb(err);
        emailVars.team = magentoOrder.products[0].shortDescription || magentoOrder.products[0].description || magentoOrder.products[0].productSku.replace(/_/g, ' ');
        template('payment/final', emailVars, function (err, html, text) {
          if (err) return cb(err);
          var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
          mailOptions.to = user.email;
          //mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;
          mailOptions.html = html;
          mailOptions.subject = 'Oh Oh – Problem With Your Payment – ' + emailVars.team;
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

    });

  });
};
//Bank Done CS-639
exports.sendProcessedEmail = function  (user, amount, orderId, account, cb) {
  var emailVars = JSON.parse(JSON.stringify(config.emailVars));

  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);

  //paymentService.getUserDefaultBankId(user, function (err, bankId) {
      //paymentService.fetchBank(bankId, function (response, account) {
        emailVars.accountLast4Digits = account;

        // get the loan object
        getNameTeamFromOrder(orderId, function (err, team) {
          //var team = magentoOrder.products[0].shortDescription || magentoOrder.products[0].description || magentoOrder.products[0].productSku.replace(/_/g, ' ');
          emailTemplates(config.emailTemplateRoot, function (err, template) {

            if (err) return cb(err);
            emailVars.team = team;
            template('payment/processed', emailVars, function (err, html, text) {

              if (err) return cb(err);

              var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
              mailOptions.to = user.email;
              //mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

              mailOptions.html = html;
              mailOptions.subject = 'Payment Processed Successfully – ' + team;

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

        });

      //});
  //});
};
//TODO
exports.sendProcessedEmailCreditCard = function  (user, amount, numberCreditCard, orderId, cb) {
  var emailVars = JSON.parse(JSON.stringify(config.emailVars));

  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);
  emailVars.accountLast4Digits = numberCreditCard;

  getNameTeamFromOrder(orderId, function(err,team){
    emailTemplates(config.emailTemplateRoot, function (err, template) {
      emailVars.team = team;

      if (err) return cb(err);

      template('payment/processed', emailVars, function (err, html, text) {

        if (err) return cb(err);

        var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
        mailOptions.to = user.email;
        //mailOptions.bcc = config.emailContacts.admin + "," + config.emailContacts.developer;

        mailOptions.html = html;
        mailOptions.subject = 'Payment Processed Successfully – ' + team;

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
  });
};
//TODO
exports.sendRetryEmail = function  (userFirstName, email, accountLast4Digits, amount, daysToTry, cb) {

  var emailVars = JSON.parse(JSON.stringify(config.emailVars));

  emailVars.userFirstName = userFirstName;
  emailVars.accountLast4Digits = accountLast4Digits;
  emailVars.amount = parseFloat(amount).toFixed(2);;
  emailVars.daysToTry = daysToTry;

  emailTemplates(config.emailTemplateRoot, function (err, template) {

    if (err) return cb(err);

    template('payment/retry', emailVars, function (err, html, text) {

      if (err) return cb(err);

      var mailOptions = config.emailOptions;
      mailOptions.to = email;
      //mailOptions.bcc = config.emailContacts.developer;
      mailOptions.html = html;
      mailOptions.subject = 'Payment notification: Payment failed. We will retry in a few days. ';

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
//Bank and Card Done CS-639
exports.sendFinalEmail = function  (user, amount, orderId, account, cb) {
  var emailVars = JSON.parse(JSON.stringify(config.emailVars));
  emailVars.userFirstName = user.firstName;
  emailVars.amount = parseFloat(amount).toFixed(2);
  emailVars.accountLast4Digits = account.last4;
    getNameTeamFromOrder(orderId, function (err, team) {
      emailTemplates(config.emailTemplateRoot, function (err, template) {
        if (err) return cb(err);
        emailVars.team = team;//magentoOrder.products[0].shortDescription || magentoOrder.products[0].description || magentoOrder.products[0].productSku.replace(/_/g, ' ');
        template('payment/final', emailVars, function (err, html, text) {
          if (err) return cb(err);
          var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
          mailOptions.to = user.email;
          mailOptions.html = html;
          mailOptions.subject = 'Oh Oh – Problem With Your Payment – ' + team;
          mailOptions.attachments = [];
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return cb(error);
            } else {
              return cb(null, info);
            }
          });
        });
      });
    });
};
//Done
exports.sendEmailReminderPyamentParents = function (user, nameTeam, schedule, value, period, card, cb) {
  var card4 = card.data[0].last4 ||'XXXX';
  var test = new moment(schedule.nextPaymentDue).format("dddd, MMMM Do YYYY");
  emailTemplates(config.emailTemplateRoot, function (errTemplate, template) {
    if (errTemplate) return cb(errTemplate);
    var emailVars = JSON.parse(JSON.stringify(config.emailVars));
    emailVars.userFirstName = user[0].firstName;
    emailVars.Last4Digits = card4;
    emailVars.amount = parseFloat(schedule.price).toFixed(2);
    emailVars.datePaymentDue = new moment(schedule.nextPaymentDue).format("dddd, MMMM Do YYYY");
    emailVars.teamName = nameTeam;
    template('payment/laterChargePayment', emailVars, function (err, html, text) {
      if (err) return cb(err);
      var mailOptions = JSON.parse(JSON.stringify(config.emailOptions));
      mailOptions.html = html;
      mailOptions.to = user[0].email;
      //mailOptions.bcc = config.emailContacts.developer;
      mailOptions.subject = 'Heads Up: '+nameTeam+' Payment Coming Up In A Couple Of Days ';
      mailOptions.attachments = [];
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(error);
        } else {
          return cb(null, info);
        }
      });
    });
  });
};
//Done
function getNameTeamFromOrder(orderId, cb){
  commerceService.orderLoad(orderId, function (err, magentoOrder) {
    if(err || !magentoOrder || !magentoOrder.products){
      var magentoError = '*Convenience Select*';
      return cb(null, magentoError);
    }
    var teamName = magentoOrder.products[0].shortDescription || magentoOrder.products[0].description || magentoOrder.products[0].productSku.replace(/_/g, ' ');
    return cb(null, teamName);
  });
}

