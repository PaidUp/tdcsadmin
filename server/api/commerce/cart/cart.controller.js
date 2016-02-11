'use strict';

var _ = require('lodash');
var cartService = require('./cart.service');
var config = require('../../../config/environment');
var logger = require('../../../config/logger');
//var mix = require('../../../config/mixpanel');

// Creates a new cart in the DB.
exports.create = function(req, res) {
  cartService.cartCreate(function(err, cartId){
    //cartService.addFee(cartId, function(err, data) {
      //res.json(200, {cartId: cartId});
    //})
    res.status(200).json({cartId: cartId});
  });
}

exports.add = function (req, res) {
  if(!req.body && !req.body.products  && !req.body.cartId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id and products are required"
    });
  }
  cartService.cartAdd(req.body, function (err, cartAdd) {
    if(err) return handleError(res, err);
    //mix.panel.track("addCart", mix.mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(cartAdd);
  });
}

exports.remove = function (req, res) {
  if(!req.body && !req.body.products  && !req.body.cartId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "cartId or products is required"
    });
  }
  cartService.cartRemove(req.body, function (err, cartRemove) {
    if(err) return handleError(res, err);
    //mix.panel.track("removeCart", mix.mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(cartRemove);
  });
}

exports.list = function (req, res) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartList(req.params.id, function (err, cartList) {
    if(err) return handleError(res, err);
    res.status(200).json(cartList);
  });
}

exports.address = function (req, res) {
  cartService.cartAddress(req.body, function (err, cartAddress) {
    if(err) return handleError(res, err);
    //mix.panel.track("addressCart", mix.mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(cartAddress);
  });
}

exports.view = function (req, res) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartView(req.params.id, function (err, cartView) {
    if(err) return handleError(res, err);
    res.status(200).json(cartView);
  });
}

exports.totals = function (req, res) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id is required"
    });
  }
  cartService.cartTotals(req.params.id, function (err, cartTotals) {
    if(err) return handleError(res, err);
    res.status(200).json(cartTotals);
  });
}

function handleError (res, err) {
  logger.info(err, err);
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}

exports.couponAdd = function (req, res) {
  if(!req.body && !req.body.coupon  && !req.body.cartId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Cart Id and coupon are required"
    });
  }
  cartService.cartCouponAdd(req.body, function (err, isAddCoupon) {
    if(err) return handleError(res, err);
    //mix.panel.track("addCart", mix.mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(isAddCoupon);
  });
}
