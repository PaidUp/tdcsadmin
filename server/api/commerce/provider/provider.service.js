'use strict';

var mongoose = require('mongoose');
var Provider = require('./provider.model.js');
var Blind = require('blind');
//var isValidSSN = require('is-valid-ssn');
var config = require('../../../config/environment/index');

function save(provider, cb) {
  //console.log('Provider service',Provider);
  provider.save(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function create(provider, cb) {
  Provider.create(provider, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function findOne(filter, fields, cb) {
  Provider.findOne(filter, fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function findById(id, cb) {
  Provider.findById(id, function (err, provider) {
      if(err) {
        return cb(err);
      }
      return cb(null, provider);
    }
  );
}

function find(filter,fields, cb) {
  Provider.find(filter,fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function update(filter, value, cb) {
  Provider.update(filter, value, function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

var encryptKey = config.encryptKey;
function encryptField(value){
  var encrypted = new Blind({ encryptKey: encryptKey }).encrypt(value);
  return encrypted;
}

function decryptField(encryptedValue){
  var decrypted = new Blind({ encryptKey: encryptKey }).decrypt(encryptedValue);
  return decrypted;
}

/*function verifySSN(ssn) {
  return isValidSSN(ssn);
}*/

function getlast4Field(encryptedValue){
  var last4Field = decryptField(encryptedValue);
  return last4Field.substring(last4Field.length - 4, last4Field.length);
}

exports.save = save;
exports.create = create;
exports.findOne = findOne;
exports.findById = findById;
exports.find = find;
exports.update = update;
exports.encryptField = encryptField;
exports.decryptField = decryptField;
//exports.verifySSN = verifySSN;
exports.getlast4Field = getlast4Field;
