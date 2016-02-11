'use strict';

var mongoose = require('mongoose');
var config = require('../../config/environment');
var balanced = require('balanced-official');
var https = require('https');
var querystring = require('querystring');
var async = require('async');
var camelize = require('camelize');
var balancedApi = config.balanced.api;

function setBalancedApi(api) {
  balancedApi = api;
}

function httpRequest(method, bodyRequest, path, cb) {
  var bodyRequest = querystring.stringify(bodyRequest);

  var options = {
    host: 'api.balancedpayments.com',
    port: 443,
    method: method,
    path: path,
    headers: {
      'Authorization': 'Basic ' + new Buffer(balancedApi + ':' + '').toString('base64'),
      'Accept': 'application/vnd.api+json;revision=1.1',
      'Content-Length': bodyRequest.length,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var body = "";
  var request = https.request(options, function(res){
    res.on('data', function(data) {
      body += data;
    });
    res.on('end', function() {
      var pbody = {};
      if(body !== ""){
        pbody = JSON.parse(body);
      }
      return cb(null, pbody);
    })
    res.on('error', function(e) {
      return (e, null);
    });
  });
  request.write(bodyRequest);
  request.end();
}

function createCustomer(customer, cb) {
  balanced.configure(balancedApi);
  balanced.marketplace.customers.create(customer).then(function(data) {
    return cb(null, (data));
  }, function(err) {
    return cb(err, null);
  });
}

/*
 curl https://api.balancedpayments.com/customers/CU79NALWd1ER6sitFjLXzhSM \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV:
 */
function fetchCustomer(customerId, cb) {
  httpRequest("GET", null, '/customers/'+customerId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, (data));
  });
}

function createCard(cardDetails, cb) {
  balanced.configure(balancedApi);
  balanced.marketplace.cards.create(cardDetails).then(function(data) {
    return cb(null, (data));
  }, function(err) {
    return cb(err, null);
  });
}

/*
 curl https://api.balancedpayments.com/cards/CC602psezvP6cFbUPM4nL1ew \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-1QMOvmraKVImojntr7UXXXXXXXXXX: \
 -X PUT \
 -d "customer=/customers/CU4xXeEzL1KE123DfVBKk0h2"
 */
function associateCard(customerId, cardId, cb) {
  httpRequest("PUT", {customer:'/customers/' + customerId}, '/cards/'+cardId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

function createBank(bankDetails, cb) {
  balanced.configure(balancedApi);
  balanced.marketplace.bank_accounts.create(bankDetails).then(function(data) {
    return cb(null, (data));
  }, function(err) {
    return cb(err, null);
  });
}

/*
curl https://api.balancedpayments.com/bank_accounts/BA4rlGQ3rtmDL1Mal7ZWWdeZ \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV: \
 -X PUT \
 -d "customer=/customers/CU1FzaYMLLAEWG8JvB3VAFwh"
 */
function associateBank(customerId, cardId, cb) {
  httpRequest("PUT", {customer:'/customers/' + customerId}, '/bank_accounts/'+cardId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/customers/{customers.id}/bank_accounts \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV: \
 -X GET
 */
function listCustomerBanks(customerId, cb) {
  httpRequest("GET", null, '/customers/' + customerId + '/bank_accounts', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/customers/{customers.id}/cards \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV: \
 -X GET
 */
function listCards(customerId, cb) {
  httpRequest("GET", null, '/customers/' + customerId + '/cards', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/cards/CC506bcUEIw5mc2iaRELcXHv \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-8fUgOargKswWhprGjGgmLp1Wkd09TqBj:
 */
function fetchCard(cardId, cb) {
  httpRequest("GET", null, '/cards/' + cardId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/bank_accounts/CC506bcUEIw5mc2iaRELcXHv \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-8fUgOargKswWhprGjGgmLp1Wkd09TqBj:
 */
function fetchBank(bankId, cb) {
  httpRequest("GET", null, '/bank_accounts/' + bankId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}


/*
curl https://api.balancedpayments.com/customers/CU40AyvBB6ny9u3oelCwyc3C/orders \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-25ZY8HQwZPuQtDecrxb671LilUya5t5G0: \
 -d "description=Order #12341234"
*/
function createOrder(merchantCustomerId, description, cb) {
  httpRequest("POST", {description: description}, '/customers/'+merchantCustomerId+'/orders', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    if (data.errors) {
      return cb(data.errors);
    }
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/cards/CC602psezvP6cFb1234nL1ew/debits \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-1QMOvmraKVImojntr7UXXXXXXXXXX: \
 -d "amount=5000" \
 -d "appears_on_statement_as=ConvenienceSelectFee"
 */
function debitCard(cardId, amount, description, appearsOnStatementAs, orderId, cb) {
  httpRequest("POST",
      {
        amount: Math.round(amount * 100),
        description: description,
        order: "/orders/"+orderId,
        appears_on_statement_as: appearsOnStatementAs
      }, '/cards/'+cardId+'/debits', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/bank_accounts/BA4inLpYaYvBmxsWoxQFPoCQ/debits \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-8fUgOargKswWhprGjGgmLp1Wkd09TqBj: \
 -d "amount=5000" \
 -d "order=/orders/OR49gqHygz3Idp1jezxu2esg"
 */
function debitBank(bankId, amount, description, appearsOnStatementAs, orderId, cb) {
  httpRequest("POST",
    {
      amount: Math.round(amount * 100),
      description: description,
      order: "/orders/"+orderId,
      appears_on_statement_as: appearsOnStatementAs
    }, '/bank_accounts/'+bankId+'/debits', function(err, data){
      if (err) return cb(err);
      if(hasError(data)) return cb(handleErrors(data));
      return cb(null, camelize(data));
    });
}

/*
 curl https://api.balancedpayments.com/debits/{debit_id} \
  -H "Accept: application/vnd.api+json;revision=1.1" \
  -u ak-test-1xGEmbY58peQpnsgKEpgjuXgR1TjYdGpj:
*/
function fetchDebit(debitId, cb) {
  httpRequest("GET",
    {}, '/debits/'+debitId, function(err, data){
      if (err) return cb(err);
      if(hasError(data)) return cb(handleErrors(data));
      return cb(null, camelize(data));
    });
}

/*
 curl https://api.balancedpayments.com/orders/OR5sl2RJVnbwEf45nq5eATdz \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-25ZY8HQwZPuQtDecrxb671LilUya5t5G0: \
 -X PUT \
 -d "description=New description for order" \
 -d "meta[product.id]=1234567890" \
 -d "meta[anykey]=valuegoeshere"
 */
function updateOrderDescription(orderId, description, cb) {
  httpRequest("PUT", {description: description}, '/orders/'+orderId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}


/*
curl https://api.balancedpayments.com/bank_accounts/BA31t1BZ0fBcAvdkEPJe6vZP/verifications \
  -H "Accept: application/vnd.api+json;revision=1.1" \
  -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV: \
  -X POST
*/
function createBankVerification(bankId, cb) {
  httpRequest("POST", null, '/bank_accounts/'+ bankId +'/verifications', function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/verifications/BZ3mEk8cx3CmgJ62Q01nV6Zq \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV: \
 -X PUT \
 -d "amount_1=1" \
 -d "amount_2=1"
 */
function loadBankVerification(verificationId, cb) {
  httpRequest("GET", null, '/verifications/'+ verificationId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
}

/*
curl https://api.balancedpayments.com/verifications/BZ3mEk8cx3CmgJ62Q01nV6Zq \
  -H "Accept: application/vnd.api+json;revision=1.1" \
  -u ak-test-vO4nU7uyyuvK4Z0zcfpgag7DrB5CdleV: \
  -X PUT \
  -d "amount_1=1" \
  -d "amount_2=1"
*/
function confirmBankVerification(verificationId, amount1, amount2, cb) {
  httpRequest("PUT", {amount_1: amount1, amount_2: amount2}, '/verifications/'+ verificationId, function(err, data){
    if (err) return cb(err);
    if(hasError(data)) return cb(handleErrors(data));

    return cb(null, camelize(data));
  });
}

/*
 curl https://api.balancedpayments.com/bank_accounts/BA7iosgWjWaeqTsv3XMux19S \
 -H "Accept: application/vnd.api+json;revision=1.1" \
 -u ak-test-1xGEmbY58peQpnsgKEpgjuXgR1TjYdGpj: \
 -X DELETE
* */
function deleteBankAccount(bankId, cb){
  httpRequest("DELETE", {},'/bank_accounts/'+bankId, function(err, data){
    if(err)
      return cb(err);
    if(hasError(data))
      return cb(handleErrors(data));
    return cb(null, camelize(data));
  });
};

function listBanks(customerId, cb) {
  listCustomerBanks(customerId, function (err, dataBanks) {
    if (err) return cb(err);
    if(hasError(dataBanks)) return cb(handleErrors(dataBanks));
    delete dataBanks.meta;
    delete dataBanks.links;
    async.eachSeries(dataBanks.bankAccounts, function (bankAccount, callback) {
      loadBankVerification(bankAccount.links.bankAccountVerification, function (err, bankStatus) {
        if (err) return cb(err);
        if(hasError(dataBanks)) return cb(handleErrors(dataBanks));
        bankAccount.state = bankStatus.bankAccountVerifications[0].verificationStatus;
        bankAccount.attemptsRemaining = bankStatus.bankAccountVerifications[0].attemptsRemaining;
        delete bankAccount.can_credit;
        delete bankAccount.href;
        delete bankAccount.routingNumber;
        delete bankAccount.fingerprint;
        delete bankAccount.meta;
        delete bankAccount.address;
        delete bankAccount.canDebit;
        callback();
      });
    }, function (err) {
      if (err) {
        return cb(err);
      }
      return cb(null, camelize(dataBanks));
    });
  })
}

function hasError(response) {
  if(response.errors) {
    return true;
  }
  return false;
}

function handleErrors(response) {
  return response.errors[0].description;
}

exports.setBalancedApi = setBalancedApi;
exports.createCustomer = createCustomer;
exports.fetchCustomer = fetchCustomer;
exports.createCard = createCard;
exports.associateCard = associateCard;
exports.createBank = createBank;
exports.associateBank = associateBank;
exports.listCards = listCards;
exports.createOrder = createOrder;
exports.debitCard = debitCard;
exports.debitBank = debitBank;
exports.createBankVerification = createBankVerification;
exports.listCustomerBanks = listCustomerBanks;
exports.confirmBankVerification = confirmBankVerification;
exports.loadBankVerification = loadBankVerification;
exports.updateOrderDescription = updateOrderDescription;
exports.listBanks = listBanks;
exports.fetchBank = fetchBank;
exports.fetchCard = fetchCard;
exports.fetchDebit = fetchDebit;
exports.deleteBankAccount = deleteBankAccount;
