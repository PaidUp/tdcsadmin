'use strict';
var config = require('../../../config/environment');
var TDCommerceService = require('TDCore').commerceService;
var logger = require('../../../config/logger');

function cartCreate (cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartCreate(function (err, cartId){
    if(err) return cb(err);
    TDCommerceService.cartAddress(cartId, config.commerce.defaultAddress,function(err, dataAddress) {
      //if(err) {return cb(err);}
      if(err) {logger.log(err, err);}
    });
    return cb(null, cartId);
  });
}

function cartList (cartId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartList(cartId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartAdd (shoppingCartProductEntity, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartAdd(shoppingCartProductEntity, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartRemove (shoppingCartProductEntity,cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartRemove(shoppingCartProductEntity,function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartAddress (cartId, shoppingCartAddressEntity, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartAddress(cartId, shoppingCartAddressEntity, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartView (shoppingCartId, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartView(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function cartTotals (shoppingCartId,cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartTotals(shoppingCartId,function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function prepareMerchantProducts (shoppingCart, cb) {
  var products = [];

  // TODO
  // check on every product if it has a different Merchant (provider or BPMerchantId)

  var product = shoppingCart.items[0];
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.catalogProduct(product.productId, function(err, data){
    products.push({
      description: data.description,
      shortDescription: data.shortDescription,
      seasonEnd: data.seasonEnd,
      productId : data.productId,
      productSku: data.sku,
      productPurchaseSku: product.sku,
      TDPaymentId: data.balancedCustomerId
    });
    return cb(null, products);
  });
}

exports.addLoanInterest = function (cartId, amount, cb){
  var shoppingCartProductEntityArray = {
    cartId : cartId,
    products : [{
      product_id: config.commerce.products.interest.id,
      sku: config.commerce.products.interest.sku,
      qty: 1
    }]
  };
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartAdd(shoppingCartProductEntityArray, function(err, data) {
    if(err) return cb(err);
    TDCommerceService.cartUpdateProductPrice(cartId, config.commerce.products.interest.id, amount, function(err, data) {
      if(err) return cb(err);
      return cb(null, data);
    })
  });
}

exports.addFee = function (cartId, cb){
  var shoppingCartProductEntityArray = {
    cartId: cartId.cartId,
    products : [{
      product_id: config.commerce.products.fee.id,
      sku: config.commerce.products.fee.sku,
      qty: 1
    }]
  };
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartAdd(shoppingCartProductEntityArray, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function cartCouponAdd (cartCoupon, cb) {
  TDCommerceService.init(config.connections.commerce);
  TDCommerceService.cartCouponAdd(cartCoupon, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

exports.cartCreate = cartCreate;
exports.cartList = cartList;
exports.cartAdd = cartAdd;
exports.cartRemove = cartRemove;
exports.cartAddress = cartAddress;
exports.cartView = cartView;
exports.cartTotals = cartTotals;
exports.prepareMerchantProducts = prepareMerchantProducts;
exports.cartCouponAdd = cartCouponAdd;
