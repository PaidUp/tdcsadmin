'use strict';

var async = require('async');
var config = require('../../../config/environment');
var tdCommerceService = require('TDCore').commerceService;
tdCommerceService.init(config.connections.commerce);

function catalogList (categoryId, cb) {
	tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogCategoryV2(categoryId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function groupedList (productId, cb) {
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogProductV2(productId, function(err, data) {
    if(err) return cb(err);
    return cb(null, data);
  });
}

function catalogProduct (productId, cb) {
	tdCommerceService.init(config.connections.commerce);
	tdCommerceService.catalogProduct(productId,function(err, data) {
    if(err) return cb(err);
  	return cb(null, data);
  });
}

function catalogCreate (productData, cb) {
  tdCommerceService.init(config.connections.commerce);
  tdCommerceService.catalogCreate(productData,function(err, product) {
    if(err) return cb(err);
    return cb(null, product);
  });
}

exports.catalogList = catalogList;
exports.catalogProduct = catalogProduct;
exports.catalogCreate = catalogCreate;
exports.groupedList = groupedList;
