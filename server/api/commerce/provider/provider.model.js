'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../../config/environment/index.js');

var ProviderSchema = new Schema({
    //Team info
    teamName: { type: String, required: true},//email //response
    teamNumber: { type: String, default: '1'},//email
    teamAverageSize: { type: String, default: '1' },//email
    teamSport:{type: String},
    //End team info
    //Owner info
    ownerId: { type: String},
    ownerFirstName: { type: String, required: true},//required //email //newDesign
    ownerLastName: { type: String, required: true},//required //email //newDesign
    ownerDOB: { type: Date},//required //email //newDesign
    ownerSSN: { type: String, required: true},//required //email //newDesign
    ownerEmail: { type: String}, //email //response
    ownerPhone: { type: String}, //email
    //End owner info
    //Billing info
    country: { type: String, default: 'US'},//required //email //response
    state: { type: String, required: true},//required //email //newDesign
    city: { type: String, required: true},//required //email //newDesign
    zipCode: { type: String, required: true},//required //newDesign
    averagePayment: { type: String, default: '1'}, //email
    EIN: { type: String},//required //email //newDesign
    Address: { type: String, required: true},//required //email //newDesign
    AddressLineTwo: { type: String},//required //email //newDesign
    website: { type: String, default: 'https://www.convenieceselect.com'}, //email
    businessName: { type: String, required: true},//required //email //newDesign
    phoneNumber: { type: String, default: '0000000000'}, //email
    businessType: { type: String, required: true},//required //newDesign
    //End billing info
    //Billing info
    aba: { type: String, required: true},//required //email //response //newDesign
    dda: { type: String, required: true},//required //email //response //newDesign
    //End billing info
    createAt: {type: Date, default: new Date()},
    updateAt: {type: Date, default: new Date()},
    verify: {type: String,default:'pending'},
    referralCode: { type: String, default: ''} // email
});

/**
 * Pre-save hook
 */
 ProviderSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();
    this.update_at = new Date();
    next();
  });


module.exports = mongoose.model('Provider', ProviderSchema, config.mongo.options.prefix + 'providers');
