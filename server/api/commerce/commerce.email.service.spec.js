'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var commerceEmailService = require("./commerce.email.service");

var fakeDataProvider = {
    businessName:'unit test',
    teamName:'commerce email service',
    ownerDOB: '12/12/1980',
    ownerSSN : '123-1233-123',
    ownerPhone : '555-5555-555',
    country : 'US',
    state : 'TX',
    city : 'Austin',
    EIN : '00-0000000',
    Address : 'street siempre viva 123'
    
    
};

describe('commerce.email.service', function() {

    it('sendContactEmail without ownerEmail', function (done) {
        commerceEmailService.sendContactEmail(fakeDataProvider,function(err, data){
            assert.equal(err, 'Email is not valid');
            done();
        });
    });

    it('sendContactEmail without ownerEmail', function (done) {
        this.timeout(15000);
        fakeDataProvider.ownerEmail = 'jesse.cogollo@gmail.com';
        commerceEmailService.sendContactEmail(fakeDataProvider,function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

});

