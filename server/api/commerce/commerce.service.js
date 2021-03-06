'use strict';

var paymentService = require('../payment/payment.service');
var async = require('async');
var TDCommerceService = require('TDCore').commerceService;
var config = require('../../config/environment');
var logger = require('../../config/logger');
var providerService = require('./provider/provider.service');
var Provider = require('./provider/provider.model');
var PUCommerceConnect = require('paidup-commerce-connect')
var PUScheduleConnect = require('paidup-schedule-connect')
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

function orderSearch(params, cb){

  PUCommerceConnect.orderSearch({
    baseUrl : config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    params: params
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (orderResult) {
      return cb(null, orderResult)
    },
  });

}

function addPaymentPlan(params, cb){
  getPaymentPlan(params.orderId, null, function(err, pp){
    if(err){
      return cb(err);
    }else{
      params.version = pp.version || 'v1';
      editPaymentPlan(pp, params, function(err2, pp2){
        if(err2){
          return cb(err2);
        }else{
          pp2.attempts = [];
          pp2.status = "pending"
          delete pp2.id;

          let ppe = {
            baseUrl : config.connections.commerce.baseUrl,
            token: config.connections.commerce.token,
            userSysId: params.userSysId,
            orderId : params.orderId,
            paymentsPlan: [pp2]
          }

          PUCommerceConnect.orderAddPayments(ppe).exec({
            // An unexpected error occurred.
            error: function (err) {

              console.log('err', err)

              return cb(err)
            },
            // OK.
            success: function (orderResult) {
              console.log('ORDER Result: ', JSON.stringify(orderResult))
              return cb(null, orderResult)
            },
          });
        }
      })
    }
  });



}

function editOrder(params, cb){
  getPaymentPlan(params.orderId, params.paymentPlanId, function(err, pp){
    if(err){
      console.log('throw ee', err)
      return cb(err);
    }else{
      editPaymentPlan(pp, params, function(err2, pp2){
        if(err2){
          console.log('throw err2 ',err2)

          return cb(err2);
        }else{

          let ppe = {
            baseUrl : config.connections.commerce.baseUrl,
            token: config.connections.commerce.token,
            orderId: params.orderId,
            userSysId: params.userSysId,
            paymentPlanId : params.paymentPlanId,
            paymentPlan: pp2
          }

          console.log('PPE: ',ppe)

          PUCommerceConnect.orderUpdatePayments(ppe).exec({

            // An unexpected error occurred.
            error: function (err) {
              console.log('throw err3 ',err)

              return cb(err)
            },
            // OK.
            success: function (orderResult) {
              return cb(null, orderResult)
            },
          });
        }
      })
    }
  });



}

function editPaymentPlan(pp, params, cb){
  let originalPrice = params.originalPrice;
  let description = params.description;
  let dateCharge = params.dateCharge;
  let status = params.status;
  let wasProcessed = params.wasProcessed || false;

  PUScheduleConnect.calculatePrice({
    version: params.version,
    baseUrl: config.connections.schedule.baseUrl,
    token: config.connections.schedule.token,
    originalPrice: originalPrice,
    stripePercent: pp.processingFees.cardFeeDisplay,
    stripeFlat: pp.processingFees.cardFeeFlatDisplay,
    paidUpFee: pp.collectionsFee.fee,
    discount: pp.discount,
    payProcessing: pp.paysFees.processing,
    payCollecting: pp.paysFees.collections,
  }).exec({
// An unexpected error occurred.
    error: function (err){
      return cb(err);
    },
// OK.
    success: function (result){
      result.body = JSON.parse(result.body);
      pp.version = result.body.version;
      pp.price = result.body.owedPrice;
      pp.basePrice = result.body.basePrice;
      pp.originalPrice = originalPrice;
      pp.description = description;
      pp.dateCharge = dateCharge;
      pp.wasProcessed = wasProcessed;
      pp.account = params.account;
      pp.accountBrand = params.accountBrand;
      pp.last4 = params.last4;
      pp.typeAccount =  params.typeAccount;
      pp.totalFee = result.body.totalFee;
      pp.feeStripe = result.body.feeStripe;
      pp.feePaidUp = result.body.feePaidUp;
      pp.status = status;
      return cb(null, pp);
    },
  });
}

function getPaymentPlan(orderId, paymentPlanId, cb){
  PUCommerceConnect.orderGet({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    orderId: orderId,
    limit: 1
  }).exec({
// An unexpected error occurred.
    error: function (err){
      return cb(err)
    },
// OK.
    success: function (result){
      let res = null;
      if(!paymentPlanId){
        res = result.body.orders[0].paymentsPlan[0]
      }else{
        result.body.orders[0].paymentsPlan.map(function(pp){
          if(pp._id === paymentPlanId){
            res = pp;
          }
        });
      }
      if(res){
        return cb(null, res);
      }
      return cb('payment plan not found')
    },
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
exports.orderSearch = orderSearch;
exports.editOrder = editOrder;
exports.addPaymentPlan = addPaymentPlan;
