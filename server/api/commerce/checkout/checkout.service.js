'use strict';

var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;
var tdUserService = require('TDCore').userService;
var emailNotification = require('../../../components/util/notifications/email-notifications');
var tdScheduleService = require('../schedule/schedule.service')();
var logger = require('../../../config/logger');

exports.placeOrder = function(user, cartId, addresses, orderData, cb){
  logger.log('info', '5.3.1) checkoutService - placeOrder - user: %s', user)
  logger.log('info', '5.3.1) checkoutService - placeOrder - cartId: %s', cartId)
  logger.log('info', '5.3.1) checkoutService - placeOrder - addresses: %s', addresses)
  logger.log('info', '5.3.1) checkoutService - placeOrder - orderData: %s', orderData)
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.customerCreate(user, function(err, customer) {
    if(err) {return cb(err);}
    logger.log('info', '5.3.2) checkoutService - customerCreate - customer: %s', customer)
    user.meta.TDCommerceId = customer;
    tdUserService.init(config.connections.user);
    tdUserService.save(user, function(err, userPrepared){
      if(err) {return cb(err);}
      logger.log('info', '5.3.3) checkoutService - userSave - userPrepared: %s', userPrepared)
      tdCommerceService.init(config.connections.commerce);
      tdCommerceService.cartAddress(cartId, addresses, function(err, data) {
        if(err) {return cb(err);}
        logger.log('info', '5.3.4) checkoutService - cartAddress - data: %s', data)
        tdCommerceService.cartUpdateCustomer(cartId.cartId, userPrepared, function(err, data) {
          if(err) {return cb(err);}
          logger.log('info', '5.3.5) checkoutService - cartUpdateCustomer - data: %s', data)
          tdCommerceService.cartSetShipping(cartId.cartId,config.commerce.shippingMethod,function(err, dataShipping) {
            if(err) {return cb(err);}
            logger.log('info', '5.3.6) checkoutService - cartSetShipping - dataShipping: %s', dataShipping)
            tdCommerceService.cartSetPayment(cartId.cartId, {method: config.commerce.paymentMethod,po_number: orderData.payment}, function(err, dataPayment) {
              if(err) {return cb(err);}
              logger.log('info', '5.3.7) checkoutService - cartSetPayment - dataPayment: %s', dataPayment)
              tdCommerceService.cartPlace(cartId.cartId, function(err, dataOrderId) {
                if(err) {return cb(err);}
                logger.log('info', '5.3.8) checkoutService - cartPlace - dataOrderId: %s', dataOrderId)
                var paramsSchedule = {
                  productId :orderData.products[0].productId,
                  price: orderData.price,
                  isInFullPay: orderData.isInFullPay,
                  discount: orderData.discount};
                  logger.log('info', '5.3.9) checkoutService - paramsSchedule: %s', paramsSchedule)
                tdCommerceService.generateScheduleV2(paramsSchedule, function(err,schedule){
                  if(err) {return cb(err);}
                  logger.log('info', '5.3.10) checkoutService - generateScheduleV2 - schedule: %s', schedule)
                  if(orderData.isInFullPay){
                    schedule.name = 'One Payment Schedule'
                  }else{
                    schedule.name = 'Customize Schedule'
                  }
                  schedule.accountId = orderData.cardId
                  schedule.orderId = dataOrderId,
                  schedule.meta = {
                    org_name : orderData.products[0].productSku,
                    sku : orderData.products[0].productPurchaseSku,
                    athlete_first_name : orderData.athleteFirstName,
                    athlete_last_name : orderData.athleteLastName
                  }
                  tdScheduleService.createPaymentPlanFull(schedule, function(err, scheduleData) {
                    if(err) {return cb(err);}
                    logger.log('info', '5.3.11) checkoutService - createPaymentPlanFull - scheduleData: %s', scheduleData)
                    tdCommerceService.orderCommentAdd(dataOrderId, JSON.stringify(orderData), 'pending', function(err, comment) {
                      if(err) {return cb(err);}
                      logger.log('info', '5.3.12) checkoutService - orderCommentAdd - comment: %s', comment)
                      tdCommerceService.createOrderInvoice(dataOrderId, function(err, data){
                        logger.log('info', '5.3.13) checkoutService - createOrderInvoice - data: %s', data)
                        if(err){
                          logger.log('info', '5.3.14) checkoutService - createOrderInvoice - err: %s', err)
                          err.orderId = dataOrderId
                          emailNotification.sendNotification('Error create order invoice', err, function(err, data){
                          });
                        }else if(data.invoiceErr){
                          emailNotification.sendNotification('Error create order invoice', data, function(err, data){
                          });
                        }
                        return cb(null, dataOrderId, schedule);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

