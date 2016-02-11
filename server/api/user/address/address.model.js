'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AddressesSchema = new Schema({
  type: String,
  label: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  zipCode: String
});

module.exports = mongoose.model('Address', AddressesSchema);