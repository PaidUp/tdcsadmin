'use strict';

var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;
var webhookService = require("./webhook.service");

var fakeData = {
    json:'unit test webhook service'
};

describe('webhook.service', function() {
    it('sendEmail', function (done) {
        this.timeout(15000);
        webhookService.sendEmail(fakeData,function(err, data){
            assert.equal(err, null);
            assert(data);
            assert(data.accepted);
            done();
        });
    });

});

