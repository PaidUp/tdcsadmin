'use strict';

var paymentService = require('../payment/payment.service');
var loanService = require('../loan/loan.service');
var async = require('async');
var TDCommerceService = require('TDCore').commerceService;
var config = require('../../config/environment');
var logger = require('../../config/logger');
var providerService = require('./provider/provider.service');
var Provider = require('./provider/provider.model');
TDCommerceService.init(config.connections.commerce);

var ORDER_STATUS = {
  HOLD  : 'hold',
  CANCEL : 'cancel'
}

function getUserOrders(user, cb) {
  var orders = [];
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderList({customer_id: user.meta.TDCommerceId}, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    async.eachSeries(magentoOrders, function (order, callback) {
      getOrder(user, order.incrementId, function (err, magentoOrder) {
        if (err) {
          callback(err);
        }else{
          orders.push(magentoOrder);
          callback();
        }
      });
    }, function (err) {
      if (err) { return cb(err); }
      return cb(null, orders);
    });
  });
}

function getOrder(user, orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderLoad(orderId, function (err, magentoOrder) {

    logger.debug('magento Order' , magentoOrder);

    if (err) return cb(err);

    if (magentoOrder.cardId && magentoOrder.cardId.indexOf('ba_') === 0) {

      paymentService.fetchBank(user.meta.TDPaymentId,magentoOrder.cardId, function (err, bank) {
        if (err) {
          return cb(err);
        }
        magentoOrder.bank = bank;
        return cb(null, magentoOrder);
      });

    } else if (magentoOrder.cardId && magentoOrder.cardId.indexOf('card_') === 0) {
      paymentService.fetchCard(user.meta.TDPaymentId ,magentoOrder.cardId, function (err, card) {
        if (err) {
          return cb(err);
        }
        magentoOrder.card = card;
        return cb(null, magentoOrder);
      });
    }
    else {
      return cb(null, magentoOrder);
    }
  });
}

function getOrderBasic(orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderLoad(orderId, function (err, magentoOrder) {

    logger.debug('magento Order' , magentoOrder);

    if (err) return cb(err);

    return cb(null, magentoOrder);
  });
}

function getUsertransactions(user, cb) {
  var transactions = [];
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderList({customer_id: user.meta.TDCommerceId}, function (err, magentoOrders) {
    if (err) {
      return cb(err);
    }
    async.eachSeries(magentoOrders, function (order, callback) {
      getOrder(user, order.incrementId, function (err, userOrder) {
        if (err) {
          return cb(err);
        }
        TDCommerceService.init(config.connections.commerce);
        TDCommerceService.transactionList(order.incrementId, function (err, orderTransactions) {
          if (err) {
            return cb(err);
          }
          var transaction = {
            transactions: orderTransactions,
            order: userOrder
          };
          transactions.push(transaction);
          callback();
        });
      });
    }, function (err) {
      if (err) { return cb(err); }
      return cb(null, transactions);
    });
  });
}

function transactionList(filter, cb){
  TDCommerceService.transactionList(filter, function (err, orderTransactions) {
    if (err) {
      return cb(err);
    }
    return cb(null, orderTransactions);
  });
}

function addCommentToOrder(orderId, comment, status, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderCommentAdd(orderId, comment, status, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function addTransactionToOrder(orderId, transactionId, details, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.transactionCreate(orderId, transactionId, details, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderHold(orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderUpdateStatus(orderId, ORDER_STATUS.HOLD, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderCancel(orderId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderUpdateStatus(orderId, ORDER_STATUS.CANCEL, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderList(filter, cb){
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderList(filter, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function orderLoad(orderId, cb){
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.orderLoad(orderId, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function providerRequest(userId, dataProvider, cb) {
  dataProvider.ownerId = userId;
  dataProvider.aba = providerService.encryptField(dataProvider.aba);
  dataProvider.dda = providerService.encryptField(dataProvider.dda);
  dataProvider.ownerSSN = providerService.encryptField(dataProvider.ownerSSN);
  var provider = new Provider(dataProvider);
  providerService.save(provider, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function providerResponse(providerId, verifyState, cb) {
  providerService.findOne({_id:providerId,verify:verifyState},'', function (err, providerData) {
    if (err || !providerData) return cb(err);
    providerData.aba = providerService.decryptField(providerData.aba);
    providerData.dda = providerService.decryptField(providerData.dda);
    providerData.ownerSSN = providerService.decryptField(providerData.ownerSSN);
    return cb(null,providerData);
  });
}

function providerResponseUpdate(providerId, value, cb) {
  providerService.update({_id:providerId},value, function (err, providerData) {
    if (err) return cb(err);
    return cb(null,'providerData');
  });
}

function getSchedule(productId, price, isInFullPay, discount, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.generateScheduleV2({productId: productId, price: price, isInFullPay:isInFullPay, discount:discount}, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function paymentsSchedule(params, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.paymentsSchedule(params, function (err, data) {
    if (err) return cb(err);
    return cb(null,data);
  });
}

function getListRetryPayment(cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.listRetryPayments(function (err, data) {
    if (err){
      logger.error(err);
      return cb(err)
    }
    return cb(null,data);
  });
}

function getListOrdersComplete(cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.listOrdersComplete(function (err, data) {
    if (err){
      logger.error(err);
      return cb(err);
    }
    return cb(null,data);
  });
}

function createShipment(orderList, cb){
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.createShipment(orderList, function (err, data) {
    if (err){
      logger.error(err);
      return cb(err);
    }
    return cb(null,data);
  });
}

exports.addCommentToOrder = addCommentToOrder;
exports.addTransactionToOrder = addTransactionToOrder;
exports.orderHold = orderHold;
exports.getUserOrders = getUserOrders;
exports.getOrder = getOrder;
exports.getUsertransactions = getUsertransactions;
exports.orderList = orderList;
exports.orderLoad = orderLoad;
exports.orderCancel = orderCancel;
exports.providerRequest = providerRequest;
exports.providerResponse = providerResponse;
exports.providerResponseUpdate = providerResponseUpdate;
exports.getSchedule = getSchedule;
exports.paymentsSchedule = paymentsSchedule;
exports.getListRetryPayment = getListRetryPayment;
exports.getListOrdersComplete = getListOrdersComplete;
exports.transactionList = transactionList;
exports.createShipment = createShipment;
exports.getOrderBasic = getOrderBasic
