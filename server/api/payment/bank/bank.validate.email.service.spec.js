'use strict';

var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;
var bankValidateService = require("./bank.validate.email.service");

var userFirstName = '*uni test bank email validate*';
var email = 'convenieceselect@gmail.com';
var accountLast4Digits = '*0000*';

describe('bank.validate.service', function() {
    it('sendValidateEmail', function (done) {
        this.timeout(15000);
        bankValidateService.sendValidateEmail(userFirstName, email, accountLast4Digits, function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });
});
