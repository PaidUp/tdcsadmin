'use strict';

var app = require('../../../app');
var request = require('supertest');
var assert = require('chai').assert;
var Provider = require("./provider.model");
var providerService = require("./provider.service");
var providerSpecModel = require('./provider.model.spec');
var faker = require('faker')
var tokenTDUser = 'TDUserToken-CHANGE-ME!';

var providerId, userId, token

describe('User', function() {

    describe('provider.service', function() {

        it('save', function (done) {
            var provider = new Provider(providerSpecModel.provider);
            providerService.save(provider, function(err, data){
              if(err) return done(err);
                assert.equal(err, null);
                assert(data._id);
                assert.equal(data.teamName, provider.teamName);
                assert.equal(data.teamSport, provider.teamSport);
                assert.equal(data.ownerId, provider.ownerId);
                assert.equal(data.ownerFirstName, provider.ownerFirstName);
                assert.equal(data.ownerLastName, provider.ownerLastName);
                assert.equal(data.ownerEmail, provider.ownerEmail);
                assert.equal(data.ownerPhone, provider.ownerPhone);
                assert.equal(data.state, provider.state);
                assert.equal(data.city, provider.city);
                assert.equal(data.zipCode, provider.zipCode);
                assert.equal(data.Address, provider.Address);
                assert.equal(data.businessName, provider.businessName);
                assert.equal(data.businessType, provider.businessType);
                assert.equal(data.aba, provider.aba);
                assert.equal(data.dda, provider.dda);
                assert.equal(data.verify, provider.verify);
                assert.equal(data.phoneNumber, provider.phoneNumber);
                assert.equal(data.website, provider.website);
                assert.equal(data.averagePayment, provider.averagePayment);
                assert.equal(data.country, provider.country);
                assert.equal(data.teamAverageSize, provider.teamAverageSize);
                assert.equal(data.teamNumber, provider.teamNumber);
                done();
            });
        });
    });

    describe('provider.controller', function() {

      it('/user/create', function(done) {
        request(app)
          .post('/api/v1/user/create')
          .send({
            firstName : faker.name.firstName(),
            lastName : faker.name.lastName(),
          })
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end(function(err, res) {
            if (err) return done(err);
            userId = res.body.userId
            assert(res.body.userId);
            done();
          });
      });

      it('/auth/local/signup', function(done) {
        var credentialFake = {
          userId: userId,
          email: faker.internet.email(),
          password: '123456',
          rememberMe: true
        };
        request(app)
          .post('/api/v1/auth/local/signup')
          .send(credentialFake)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end(function(err, res) {
            if (err) return done(err);
            assert(res.body.token);
            token = res.body.token
            done();
          });
      });

      it('/commerce/provider/request', function(done) {
        this.timeout(10000);
        request(app)
          .post('/api/v1/commerce/provider/request')
          .send({token:token, providerInfo:providerSpecModel.provider})
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end(function(err, res) {
            if (err) return done(err);
            assert(res.body.providerId);
            providerId = res.body.providerId
            done();
          });
      });

      it('/commerce/provider/response', function(done) {
        this.timeout(10000);
        request(app)
          .get('/api/v1/commerce/provider/response/' + providerId)
          .expect(200)
          .expect('Content-Type', 'application/json; charset=utf-8')
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });

    });
});
