'use strict';

var _ = require('lodash');
var checkoutService = require('./checkout.service');
var cartService = require('../cart/cart.service')
var paymentService = require('../../payment/payment.service');
var paymentEmailService = require('../../payment/payment.email.service');
var userService = require('../../user/user.service');
var loanService = require('../../loan/loan.service');
var cartService = require('../cart/cart.service');
var logger = require('../../../config/logger');

var contractEmail = require('../../loan/loan.contract.email.service');
var loanApplicationService = require('../../loan/application/loanApplication.service');
var userLoanService = require('../../loan/application/user/user.service');
//var mix = require('../../../config/mixpanel');

exports.place = function(req, res) {
  logger.log('info', '1) checkoutController - place start: %s', req.body)
  if(!req.body || !req.body.addresses || !req.body.paymentMethod || !req.body.payment) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Addresses, paymentMethod and payment are required params."
    });
  }
  if(! req.body.cardId && req.body.payment == "onetime") {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "CardId is required with onetime payment."
    });
  }

  if(! (['creditcard','directdebit'].indexOf(req.body.paymentMethod) > -1)) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Payment method invalid."
    });
  }
  if(! (['onetime','loan'].indexOf(req.body.payment) > -1)) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Payment type invalid."
    });
  }

  // Require params
  var orderData = {
    userId: req.user._id,
    payment: req.body.payment,
    paymentMethod: req.body.paymentMethod,
    athleteId: req.body.userId,
    athleteFirstName: req.body.athleteFirstName,
    athleteLastName: req.body.athleteLastName,
    cardId: req.body.cardId,
    customerId: req.user.meta.TDPaymentId,
    isInFullPay: req.body.isInFullPay,
    price :req.body.price,
    discount :req.body.discount

  }
  logger.log('info', '2) checkoutController - place orderData: %s', orderData)
  // Process order
  if (req.body.payment == "loan") {
    // 3) checkoutController - place - loan, req.body.payment
    loanService.findOne({_id: req.body.loanId}, function (err,loan){
      cartService.addLoanInterest(req.body.cartId, loan.interestSum, function (err, data) {
        if (err) return handleError(res, err);
        placeOrder(req.user, req.body.cartId, req.body.addresses, orderData, function (err, magentoOrderId){
          if (err) return handleError(res, err);
          loanService.findOne({_id: req.body.loanId}, function (err, loan) {
            loan.orderId = magentoOrderId;
            loanService.save(loan, function (err, dataLoan){
              //var filter = {_id:loan.applicationId};
              loanApplicationService.findOne(loan.applicationId, function (err, dataApploan) {
                var filterUserLoan = {_id:dataApploan.meta[0].userId};
                userLoanService.findOne(filterUserLoan, function (err, dataUserLoan){
                  contractEmail.sendContractEmail(dataUserLoan, dataLoan, function (err, dataEmail) {
                    //mix.panel.track("placeCheckoutSendContractEmail", mix.mergeDataMixpanel(req.body, req.user._id));
                    if(err){
                      logger.info(err, err);
                    }
                  });
                });
              });

              return res.status(200).json(magentoOrderId);
            });
          });

        });
      });
    });
  }
  else if (req.body.payment == "onetime") {
    logger.log('info', '5) checkoutController - place onetime: %s', req.body.payment)
    placeOrder(req.user, req.body.cartId, req.body.addresses, orderData, function(err, magentoOrderId){
      if (err) return handleError(res, err);
      logger.log('info', '6) checkoutController - place placeOrder: %s', magentoOrderId)
      return res.status(200).json(magentoOrderId);
    });
  }
}

function placeOrder(user, cartId, addresses, orderData, cb) {
  logger.log('info', '5.1) checkoutController - placeOrder user: %s', user)
  logger.log('info', '5.1) checkoutController - placeOrder cartId: %s', cartId)
  logger.log('info', '5.1) checkoutController - placeOrder addresses: %s', addresses)
  logger.log('info', '5.1) checkoutController - placeOrder orderData: %s', orderData)
  cartService.cartView(cartId.cartId, function (err, shoppingCart) {
    if (err) return cb(err);
    logger.log('info', '5.2) checkoutController - placeOrder - cartView - shoppingCart: %s', shoppingCart)
    cartService.prepareMerchantProducts(shoppingCart, function (err, merchantProducts) {
      if (err) return cb(err);// this err validation is not necessary.
      logger.log('info', '5.3) checkoutController - placeOrder - prepareMerchantProducts - merchantProducts: %s', merchantProducts)
      orderData.products = merchantProducts;
      checkoutService.placeOrder(user, cartId, addresses, orderData, function (err, magentoOrderId, schedule) {
        if (err) return cb(err);
        logger.log('info', '5.4) checkoutController - placeOrder - placeOrder - magentoOrderId: %s', magentoOrderId)
        logger.log('info', '5.4) checkoutController - placeOrder - placeOrder - schedule: %s', schedule)
        paymentService.prepareUser(user, function (err, user) {
          if(err) logger.log('error',err);
          logger.log('info', '5.5) checkoutController - placeOrder - prepareUser - user: %s', user)
          var team = {
            seasonEnd: merchantProducts[0].seasonEnd,
            name: shoppingCart.items[0].name,
            productId: shoppingCart.items[0].productId,
            createdAt: shoppingCart.items[0].createdAt,
            sku: shoppingCart.items[0].sku
          };
          userService.find({_id:orderData.athleteId}, function(err, child){
            logger.log('info', '5.6) checkoutController - placeOrder - child: %s', child)
            child[0].teams.push(team);
            var acountNumber;
            var action;
            if (orderData.paymentMethod==='directdebit') {
              action = 'fetchBank';
            } else {
              action = 'fetchCard';
            };
            paymentService[action](orderData.customerId, orderData.cardId, function(err, account){
              var amount = parseFloat(shoppingCart.grandTotal).toFixed(2);
              userService.save(child[0], function(err, userAthlete) {
                if(err) logger.log('error',err);
                logger.log('info', '5.7) checkoutController - paymentServicefetchCard - account: %s', account)
                var descriptionTeamEmail = merchantProducts[0].shortDescription || merchantProducts[0].description;
                paymentEmailService.sendNewOrderEmail(magentoOrderId, user.email, orderData.paymentMethod, account, amount, schedule.schedulePeriods, shoppingCart.items[0], descriptionTeamEmail, function (err, data) {
                  //mix.panel.track("placeCheckoutSendNewOrderEmail", mix.mergeDataMixpanel(orderData, user._id));
                  if(err) logger.log('error',err);
                });
                return cb(null, magentoOrderId);
              });
            });
          });
        });
      });
    });
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', 'XXX) checkoutController - handleError - err: %s', err)
  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
