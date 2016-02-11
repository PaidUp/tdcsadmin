'use strict';

var app = require('../../app');
var request = require('supertest');
var assert = require('chai').assert;
var paymentService = require('../payment/payment.service');
var paymentCronService = require('../payment/payment.cron.service');
var userService = require('../user/user.service');
var loanService = require('../loan/loan.service');
var logger = require('../../config/logger');
var random = Math.floor(Math.random() * 1000) + 1;
var moment = require('moment');
var modelSpec = require('./cronjob.model.spec');
var prepareTest = require('../../components/util/prepare.test');

describe('Cronjob workflow OK', function (){
  this.timeout(15000);

  before(function(done) {
    prepareTest.prepareEnvironment(function(err, data){
      if(err) return done(err);
      return done();
    });
  });

  describe('Prepare user', function (){
    it('Create fake user', function(done){
      var userFake = {firstName:modelSpec.firstName,lastName:modelSpec.lastName};
      request(app)
        .post('/api/v1/user/create')
        .send(userFake)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.userId);
          modelSpec.userId = res.body.userId;
          modelSpec.user = res.body;
          done();
        });
    });

    it('add credentials to fake user', function(done){
      var credentialFake = {
        userId: modelSpec.userId,
        email: modelSpec.email,
        password: modelSpec.password,
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
          modelSpec.token = res.body.token;
          done();
        });
    });

    it('Create fake child to userFake', function(done){
      var userFake = {token:modelSpec.token,firstName:modelSpec.firstName,lastName:modelSpec.lastName, gender:modelSpec.gender};
      request(app)
        .post('/api/v1/user/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(userFake)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body.userId);
          modelSpec.childId = res.body.userId;
          done();
        });
    });

    it('Create relationFake', function(done){
      var relationFake = {token:modelSpec.token,sourceUserId:modelSpec.userId,targetUserId:modelSpec.childId, type:modelSpec.typeRelation};
      request(app)
        .post('/api/v1/user/relation/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(relationFake)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          done();
        });
    });
  });

  describe('Prepare creditcard', function(){

    it('createCart', function(done) {
      request(app)
        .get('/api/v1/commerce/cart/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(modelSpec.cartId, res.body.cartId);
          modelSpec.cartId = res.body.cartId;
          done();
        });
    });

    it('addToCart', function(done) {
      var data = {cartId:modelSpec.cartId,products:modelSpec.productsCart};
      request(app)
        .post('/api/v1/commerce/cart/add')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(true, res.body);
          done();
        });
    });

    it('create token card' , function(done){
      var cardDetails = {
        number: '4012888888881881',
        cvc: '123',
        exp_month: '12',
        exp_year: '2018'
      };
      paymentService.createCard(cardDetails , function(err, token){
        if(err) return done(err);
        assert(token);

        modelSpec.tokenCard = token;
        done();
      });
    });

    it('asociate debit card' , function(done){
      request(app)
        .post('/api/v1/payment/card/associate')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send({cardId: modelSpec.tokenCard})
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          modelSpec.cardId = res.body.id
          done();
        });
    });

    it('placeOrder debit card' , function(done){
      this.timeout(60000);
      var dataPlaceCart = {cartId:modelSpec.cartId, cardId:modelSpec.cardId, addresses:[
        {mode:"billing",firstName:modelSpec.firstName,lastName:modelSpec.lastName,address1:"address1",city:"Austin",state:"TX",zipCode:11111,country:"US",telephone:"1234444555"},
        {mode:"shipping",firstName:modelSpec.firstName,lastName:modelSpec.lastName,address1:"address2",city:"Austin",state:"TX",zipCode:11111,country:"US",telephone:"1234444555"}],
        userId: modelSpec.childId,paymentMethod: "creditcard",payment: "onetime",isInFullPay: false,price: "2020.0000"};
      request(app)
        .post('/api/v1/commerce/checkout/place')
        .set('Authorization', "Bearer "+modelSpec.token)
        .send(dataPlaceCart)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          modelSpec.orderId = res.body
          done();
        });
    });

  });
/**
  describe('Prepare loan', function (){

    it('createCart', function(done) {
      request(app)
        .get('/api/v1/commerce/cart/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(modelSpec.cartId, res.body.cartId);
          modelSpec.cartId = res.body.cartId;
          done();
        });
    });

    it('addToCart', function(done) {
      var data = {cartId:modelSpec.cartId,products:modelSpec.productsCart};
      request(app)
        .post('/api/v1/commerce/cart/add')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(true, res.body);
          done();
        });
    });

    it('createLoanUser', function(done) {
      var data = modelSpec.loanUserData();
      request(app)
        .post('/api/v1/loan/application/user/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(data)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.userId);
          modelSpec.loanUserId = res.body.userId;
          modelSpec.loanUser = res.body;
          done();
        });
    });

    it('createLoanUserContact1', function(done) {
      var dataContactUserOne = {userId:modelSpec.loanUserId,label:"email",type:"email",value:modelSpec.email};
      request(app)
        .post('/api/v1/loan/application/user/contact/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(dataContactUserOne)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.contactId);
          modelSpec.cons
          done();
        });
    });

    it('createLoanUserContact2', function(done) {
      var dataContactUserTwo = {userId:modelSpec.loanUserId,label:"telephone",type:"telephone",value:"123456789"};
      request(app)
        .post('/api/v1/loan/application/user/contact/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(dataContactUserTwo)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.contactId);
          done();
        });
    });

    it('createLoanUserAddress1', function(done) {
      var dataAddressUserOne = {userId:modelSpec.loanUserId,address1:"Av. Chavez",state:"TX",city:"Austin",zipCode:"77818",country:"USA",type:"loan",label:"loan"};
      request(app)
        .post('/api/v1/loan/application/user/address/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(dataAddressUserOne)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.addressId);
          done();
        });
    });

    it('createLoanApplication', function(done) {
      this.timeout(60000);
      var dataLoanApplication = {incomeType:"Employed (Military)",monthlyGrossIncome:"123456",amount:1650,numberPayments:6,meta:{userId:modelSpec.loanUserId}};
      request(app)
        .post('/api/v1/loan/application/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(dataLoanApplication)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.applicationId);
          modelSpec.applicationId = res.body.applicationId;
          modelSpec.loanApplication = res.body
          done();
        });
    });

    it('signLoanApplication', function(done) {
      this.timeout(60000);
      var loanUser = modelSpec.getLoanUser();
      var dataLoanSign = {firstName:modelSpec.firstName,
        lastName:modelSpec.lastName,
        ssn:modelSpec.ssnLast4Digists,
        applicationId:modelSpec.applicationId,
        userId : modelSpec.loanUserId,
        applicantUserId : modelSpec.userId};
      request(app)
        .post('/api/v1/loan/application/sign')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(dataLoanSign)
        .end(function(err, res) {
          if (err) return done(err);
          assert.isNotNull(res.body.loanId);
          modelSpec.loanId = res.body.loanId;
          done();
        });
    });

    it('placeCart', function(done) {
      this.timeout(60000);

      // Place Order
      var dataPlaceCart = {cartId:modelSpec.cartId,loanId:modelSpec.loanId,addresses:[
        {mode:"billing",firstName:modelSpec.firstName,lastName:modelSpec.lastName,address1:"address1",city:"Austin",state:"TX",zipCode:11111,country:"US",telephone:"1234444555"},
        {mode:"shipping",firstName:modelSpec.firstName,lastName:modelSpec.lastName,address1:"address2",city:"Austin",state:"TX",zipCode:11111,country:"US",telephone:"1234444555"}],
        userId: modelSpec.childId,paymentMethod: "directdebit",payment: "loan"};
      request(app)
        .post('/api/v1/commerce/checkout/place')
        .set('Authorization', "Bearer "+modelSpec.token)
        .send(dataPlaceCart)
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          modelSpec.orderId = res.body
          done();
        });
    });
  });

  describe('get loan I', function (){
    it('getLoan', function(done) {
      this.timeout(60000);
      request(app)
        .get('/api/v1/loan/find/loanId/'+modelSpec.loanId)
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          modelSpec.loan = res.body;
          updateLoan(modelSpec.loanId, function(err, data){
            done();
          });

        });
    });
  });
**/
  describe('RUN cronjob I', function (){
    it('/cron', function(done) {
      this.timeout(60000);
      request(app)
        .get('/api/v1/application/cron')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          done();
        });
    });
  });

  describe('RUN cronjob II reminder payments', function (){
    it('/cron', function(done) {
      this.timeout(60000);
      request(app)
        .get('/api/v1/application/cron/reminder/payments')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          done();
        });
    });
  });

  /**
  describe('Add method payment', function (){
    it('createBank (front)', function (done) {
      this.timeout(60000);
      var bankDetails = modelSpec.bankDetails();

      paymentService.createBank(bankDetails, function (err, data) {
        if (err) done(err);
        assert.isNotNull(data.id);
        modelSpec.bankId = data.id;
        done();
      });
    });

    it('createBank (back)', function(done){
      this.timeout(60000);
      var bank = {bankId:modelSpec.bankId};
      request(app)
        .post('/api/v1/payment/bank/create')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .send(bank)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it('Associate bank', function(done){
      this.timeout(60000);
      request(app)
        .get('/api/v1/payment/bank/list')
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          modelSpec.verificationId = res.body.bankAccounts[0].links.bankAccountVerification;
          done();
        });
    });
  });

  describe('RUN cronjob II', function (){
    it('/cron', function(done) {
      this.timeout(60000);
      request(app)
        .get('/api/v1/application/cron')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          done();
        });
    });
  });

  describe('Verify method payment', function (){
    it('Verify bank', function(done){
      this.timeout(60000);
      var bank = {verificationId:modelSpec.verificationId,deposit1:1,deposit2:1};
      request(app)
        .post('/api/v1/payment/bank/verify')
        .set('Authorization', "Bearer "+modelSpec.token)
        //.expect(200)
        .send(bank)
        .end(function(err, res) {
          if (err) return done(err);

          done();
        });
    });
  });

  describe('get loan II', function (){
    it('getLoan', function(done) {
      this.timeout(60000);
      request(app)
        .get('/api/v1/loan/find/loanId/'+modelSpec.loanId)
        .set('Authorization', "Bearer "+modelSpec.token)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          modelSpec.loan = res.body;
          updateLoanTwo(modelSpec.loanId, function(err, data){
            done();
          });

        });
    });
  });

  describe('RUN cronjob III', function (){
    this.timeout(60000);
    it('/cron', function(done) {
      request(app)
        .get('/api/v1/application/cron')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.body);
          done();
        });
    });
  });

  describe('validate loan is correct', function (){
    it('/loan validate', function(done) {
      this.timeout(60000);
      var filter = {_id:modelSpec.loanId};
      loanService.findOne(filter,function(err,loan){
        if(err || !loan){
          done(err);
        }
        assert.equal(loan.state, 'active');
        assert.notEqual(loan.notifications.length, 0);
        //assert.equal(loan.schedule[0].state, 'paid');
        done();
      });
    });
  });
   **/
});

function updateLoan(loanId, cb){
  var newDateSubtract = new moment().subtract(3, 'hours').format();
  var newDateAdd = new moment().add(3, 'hours').format();
  var filter = {_id:modelSpec.loanId};
  loanService.findOne(filter,function(err,loan){
    if(err || !loan){
      cb(err);
    }
    loan.createAt = newDateSubtract;
    loan.schedule[0].paymentDay = newDateAdd;
    //loan.markModified('schedule');
    loanService.save(loan,function(err, data){
      cb(null, data);
    });
  });
}

function updateLoanTwo(loanId, cb){
  var newDate = new moment().format();
  var filter = {_id:modelSpec.loanId};
  loanService.findOne(filter,function(err,loan){
    if(err || !loan){
      cb(err);
    }
    loan.schedule[0].paymentDay = newDate;
    //loan.markModified('schedule');
    loanService.save(loan,function(err, data){
      cb(null, data);
    });
  });
}
