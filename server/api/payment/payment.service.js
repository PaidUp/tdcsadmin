'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var paymentAdapter = require('./payment.adapter');
var commerceService = require('../commerce/commerce.service');
var userService = require('../user/user.service');
var mongoose = require('mongoose');
var logger = require('../../config/logger');
var async = require('async');
var camelize = require('camelize');
var paymentEmailService = require('./payment.email.service');
var tdPaymentService = require('TDCore').paymentService;
//var mix = require('../../config/mixpanel');
var uuid = require('node-uuid');


function createCustomer(user, cb) {
  tdPaymentService.init(config.connections.payment);
  var customer = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id:  user._id
  }
  tdPaymentService.createCustomer(customer, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateCustomer(dataCustomer, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.updateCustomer(dataCustomer, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function fetchCustomer(customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchCustomer(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createCard(cardDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createCard(cardDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateCard(customerId, cardId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.associateCard({customerId:customerId, cardId:cardId}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createBank(bankDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createBank(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank(customerId, token, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.associateBank({customerId:customerId, token:token}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createOrder(providerId, description, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createOrder({merchantCustomerId:providerId, description:description}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitCard(cardId, amount, description, appearsOnStatementAs, customerId, providerId, fee, metaPayment,cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.debitCard({cardId:cardId, amount:amount, description:description,
    appearsOnStatementAs:appearsOnStatementAs, customerId:customerId,
    providerId:providerId, fee : fee, meta:metaPayment}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function debitBank(bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.debitBank({bankId:bankId,amount:amount, description:description,
    appearsOnStatementAs:appearsOnStatementAs,orderId:orderId}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function associateBank(customerId, token, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.associateBank({customerId:customerId, token:token}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCustomerBanks(customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.listCustomerBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function listCards(customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.listCards(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function createBankVerification(bankId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createBankVerification({bankId : bankId}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function loadBankVerification(verificationId, cb) {
  tdPaymentService.loadBankVerification(verificationId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function deleteBankAccount(customerId, bankId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.deleteBankAccount({bankId:bankId}, function(err, data){
    if(err) return cb(err);
    listBanks(customerId, function(err, dataBanks){
      if(dataBanks.bankAccounts.length === 0){
        userService.find({'meta.TDPaymentId':customerId}, function(err, user){
          user[0].payment = {};
          userService.save(user[0], function(err, dataUpdateUser){
            if(err){
              return cb(err);
            }
          });
        });
      }
      return cb(null, data);
    });
  });
}

function confirmBankVerification(customerId, bankId, amount1, amount2, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.confirmBankVerification({customerId:customerId, bankId:bankId, amount1:amount1, amount2:amount2}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateOrderDescription(orderId, description, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.updateOrderDescription({orderId:orderId, description:description}, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function collectPendingOrders(cb) {
  commerceService.orderList({status: ["pending","processing"]}, function(err, data) {
    var orderList = [];
    if (err) return cb(err);
    async.eachSeries(data, function (order, callback) {
      commerceService.orderLoad(order.incrementId, function (err, data) {
        if (err) return cb(err);
        orderList.push(data);
        callback();
      });
    }, function (err) {
      if (err) {
        throw err;
      }
      return cb(null, orderList);
    });
  });
}

function createOrder(merchantCustomerId, description, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createOrder({merchantCustomerId:merchantCustomerId, description:description}, function (err, data) {
    if(err) return cb(err);
    return cb(null, data.orders[0].id);
  });
}

function listBanks (customerId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.listCustomerBanks(customerId, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

/**
 * Prepare user for Balanced Payments
 * @param user
 * @param cb
 */
function prepareUser(user, cb) {
  if(user.meta.TDPaymentId === '') {
    createCustomer(user, function(err, data) {
      if (err) return cb(err);
      user.meta.TDPaymentId = data.id;
      userService.save(user,function(err, data){
        if (err) return cb(err);
        return cb(null, data);
      });
    });
  }
  else {
    return cb(null, user);
  }
}

function prepareCard(userId, cardId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchCard(userId , cardId, function(err, creditCard){
    if(err) return cb(err);
      return cb(null, creditCard);
  });
}

function prepareBank(userId, bankId, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchBank(userId, bankId, function(err, bank){
    if(err) return cb(err);
      return cb(null, bank);
  });
}

function fetchBank(customerId, bankId, cb){
  if(!bankId){
    return cb(null, null);
  }else{
    tdPaymentService.init(config.connections.payment);
    tdPaymentService.fetchBank(customerId, bankId, function(err, bank){
        if(err) return cb(err);
        return cb(null, bank);
    });
  }

}

function fetchCard(customerId ,cardId, cb){
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchCard(customerId , cardId, function(err, creditCard){
      if(err) return cb(err);
      return cb(null, creditCard);
  });
}

function fetchDebit(debitId, cb){
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.fetchDebit(debitId, function(err, bank){
    if(err) return cb(err);
    return cb(null, bank);
  });
}

function setResult (data){
  var result = {
    OrderId : uuid.v4(),
    status : 'failed'
  }
  if(data && data.id) {
    result.OrderId = data.id
    result.status = data.status
  }
  return result
}

function debitOrder(orderId, userId, providerId, amount, accountId, scheduleId, fee, metaPayment, retryId, paymentMethod, cb){
  logger.info('2a) Prepare BP customer');
  userService.find({_id: userId}, function (err, user) {
    if(err) return cb(err);
    prepareUser(user[0], function (err, user) {
      if(err) return cb(err);
        logger.info('2b) Associate BP customer account');
        var action = '', paymentMethod = '', OrderId =''
        if (accountId.indexOf('ba_') === 0) {
          action = prepareBank;
          paymentMethod: "directdebit"
        } else {
          action = prepareCard;
          paymentMethod: "creditcard"
        };
        action(user.meta.TDPaymentId, accountId, function (err, accountDetails) {
          if(err) return cb(err);
          logger.info('2c) Create BP Order accountDetails');
          debitCard(accountId, amount, "Magento: "+orderId, config.balanced.appearsOnStatementAs, user.meta.TDPaymentId, providerId, fee, metaPayment, function(errDebit, data) {
            if(err){
              logger.error('err (important)',JSON.stringify(errDebit));
            }
            if(data){
              logger.info('data (important)',JSON.stringify(data));
            }

            try{
              var result = {amount: amount, OrderId: setResult(data).OrderId,  DebitId: setResult(data).OrderId,  paymentMethod: paymentMethod,  number: accountDetails.last4, brand : accountDetails.brand, scheduleId : scheduleId, status:setResult(data).status, retryId:retryId};
            }catch(err){
              commerceService.addTransactionToOrder(orderId, uuid.v4(), {err : err}, function(errTransaction, dataTransation){
                if(errTransaction){
                  logger.error(JSON.stringify(errTransaction))
                }else{
                  logger.info(JSON.stringify(dataTransation));
                }

              });
              return cb(err);
            }
            if (data) {logger.info('data status (important)',data.status)}
            if(data && (data.status === 'succeeded' || data.status === 'verified' || data.status === 'pending')) {
              logger.info('2d) Create Magento transaction');
              commerceService.addTransactionToOrder(orderId, data.id, result, function(err, data){
                if(err) return cb(err);

                if(paymentMethod === 'directdebit'){
                  //Don't send email with the cron. should be when stripe will notify webhook about the charge.
                  //paymentEmailService.sendProcessedEmail(user, amount, orderId, result.number, function(err, data){
                    //mix.panel.track("paymentCaptureSendProcessedEmail", mix.mergeDataMixpanel(result, user._id));
                    //logger.log('info', 'send processed email. ' + data );
                    return cb(null, result);
                  //});
                } else {
                  paymentEmailService.sendProcessedEmailCreditCard(user, amount, result.number, orderId, function(err, data){
                    //mix.panel.track("paymentCaptureSendProcessedEmailCreditCard", mix.mergeDataMixpanel(result, user._id));
                    logger.info('send processed email. ' , JSON.stringify(data));
                    return cb(null, result);
                  });
                }
              });
            }
            else {
              logger.info('2d) Create Magento transaction (failed)');
              commerceService.addTransactionToOrder(orderId, uuid.v4(), result, function(err, dataTransation){
                if(err) return cb(err);//err transaction
                if(errDebit){//err stripe
                  paymentEmailService.sendFinalEmail(user, amount, orderId, accountDetails, function(error, data){
                    logger.log('info', 'send email final email ' + data );
                    logger.log('info', 'send email final email ' + err );
                    errDebit.transactionId = data.transactionId;
                    return cb(errDebit);
                  });
                }else{
                  return cb(dataTransation);//err unknown
                }
              });
            }
          });
      });
    });
  });
}

function capture(order, user, providerId, amount, paymentMethod, scheduleId, fee, metaPayment, retryId, cb) {
  logger.info('1) paymentService > Processing ' + order.incrementId);
  //NOTE: take attention with the change order variables.
  debitOrder(order.incrementId, user._id, providerId, amount, order.cardId, scheduleId, fee, metaPayment, retryId, paymentMethod, function (err, resultDebit) {
    logger.info('2) paymentService > debitOrder err' + err);
    logger.info('3) paymentService > debitOrder resuldDebit' + resultDebit);

    if(err){

      return cb(err);
    }
    return cb(null, resultDebit);
  });
}

function getUserDefaultBankId(user, cb) {
  // Check bank accounts
  listBanks(user.meta.TDPaymentId, function(err, data){
    if(err) return cb(err);
    if(data.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var bank;
    for (var i = 0; i < data.length; i++) {
      bank = data[i];
      if(bank.state == 'verified') {
        return cb(null, bank.id);
      }
    }
    return cb({name: 'not-bank-verified'}, null);
  });
}

function setUserDefaultBank(user, cb) {
  getUserDefaultBankId(user, function(err, data){
    if(err && (err.name == 'not-bank-verified')) {
      user.payment = {verify:{status:'pending'}};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
    else if(err && (err.name == 'not-available-payment')) {
      user.payment = {};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
    else {
      user.payment = {verify:{status:'succeeded'}};
      userService.save(user, function(err, dataUpdateUser){
        if(err){
          return cb(err);
        }
        return cb(null,dataUpdateUser.payment);
      });
    }
  })
}

function getUserDefaultCardId(user, cb) {
  // Check bank accounts
  listCards(user.meta.TDPaymentId, function(err, data){
    if(err) return cb(err);
    if(data.data.length == 0) {
      // error
      return cb({name: 'not-available-payment'}, null);
    }
    var card = data.data[0];
    return cb(null, card.id);
  });
}

function createConnectAccount(account, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.createConnectAccount(account, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function addBankConnectAccount(bankDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.addBankToAccount(bankDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function addToSCustomer(tosDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.addToSCustomer(tosDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function addLegalCustomer(legalDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.addLegalCustomer(legalDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

function updateAccount(dataDetails, cb) {
  tdPaymentService.init(config.connections.payment);
  tdPaymentService.updateAccount(dataDetails, function(err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.paymentAdapter = paymentAdapter;
exports.createCustomer = createCustomer;
exports.associateCard = associateCard;
exports.associateBank = associateBank;
exports.debitCard = debitCard;
exports.createCard = createCard;
exports.createBank = createBank;
exports.createOrder = createOrder;
exports.listCustomerBanks = listCustomerBanks;
exports.listCards = listCards;
exports.createBankVerification = createBankVerification;
exports.loadBankVerification = loadBankVerification;
exports.confirmBankVerification = confirmBankVerification;
exports.updateOrderDescription = updateOrderDescription;
exports.prepareUser = prepareUser;
exports.collectPendingOrders = collectPendingOrders;
exports.capture = capture;
exports.getUserDefaultBankId = getUserDefaultBankId;
exports.listBanks = listBanks;
exports.setUserDefaultBank = setUserDefaultBank;
exports.fetchBank = fetchBank;
exports.fetchCard = fetchCard;
exports.fetchDebit = fetchDebit;
exports.getUserDefaultCardId = getUserDefaultCardId;
exports.deleteBankAccount = deleteBankAccount;
exports.createConnectAccount = createConnectAccount;
exports.addBankConnectAccount = addBankConnectAccount;
exports.addToSCustomer = addToSCustomer;
exports.addLegalCustomer = addLegalCustomer;
exports.updateAccount = updateAccount;
exports.updateCustomer = updateCustomer;
exports.fetchCustomer = fetchCustomer;
