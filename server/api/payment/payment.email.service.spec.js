'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var paymentEmailService = require("./payment.email.service");

var user = [{email:'convenieceselect@gmail.com', firstName:'*uni test payment email service*'}];
var orderId = '*000000000*';
var email = 'convenieceselect@gmail.com';
var paymentMethod = '*paymentMethod*';
var last4Digits = '*1234*';
var amount = '1200000';
var item = {name:'*00U CS*',sku:'*sku*'};
var schedules = [{'nextPaymentDue':new Date(), price: 1200}];
var period = '*period*';
var card = {data:[{last4:'*0000*'}]};
var description = '*description*';
var account = {
    bankAccounts:[{last4:'*accountNumber*', status:'new'}]
};

describe('payment.email.service', function() {
    it('sendNewOrderEmailCard', function (done) {
        this.timeout(15000);//orderId, email, paymentMethod, account, amount, schedules, item, teamName
        paymentEmailService.sendNewOrderEmail(orderId, email, paymentMethod, account.bankAccounts[0], amount, schedules, item, description, function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendNewOrderEmailBank UNVERIFIED', function (done) {
        this.timeout(15000);
        var paymentMethod = 'directdebit';
        paymentEmailService.sendNewOrderEmail(orderId, email, paymentMethod, account.bankAccounts[0], amount, schedules, item, description, function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendNewOrderEmailBank VERIFIED', function (done) {
        this.timeout(15000);
        var paymentMethod = 'directdebit';
        account.bankAccounts[0].status = 'VERIFIED';
        paymentEmailService.sendNewOrderEmail(orderId, email, paymentMethod, account.bankAccounts[0], amount, schedules, item, description, function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendEmailReminderPyamentParents', function (done) {
        this.timeout(15000);
        paymentEmailService.sendEmailReminderPyamentParents(user, item.name, schedules[0], amount, period, card, function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendFinalEmail', function (done) {
        this.timeout(15000);
        paymentEmailService.sendFinalEmail(user[0], amount, orderId, account, function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendProcessedEmail', function (done) {
        this.timeout(15000);
        paymentEmailService.sendProcessedEmail(user[0], amount, orderId, account, function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

    it('sendRemindToVerifyAccount', function (done) {
        this.timeout(15000);
        paymentEmailService.sendRemindToVerifyAccount(orderId, user[0], account.bankAccounts[0], "", function(err, data){
            assert(data);
            assert(data.accepted);
            done();
        });
    });

});
