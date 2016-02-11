'use strict';

// var app = require('../../app');
// var request = require('supertest');
var assert = require('chai').assert;
var scheduleService = require("./schedule/schedule.service")();
var commerceService = require("./commerce.service");

describe.only('commerce service v2', function() {
  let result = {}
  it('payment Cron paymentSchedule', function (done) {
    let orderId = '100000155' // 100000065
    scheduleService.paymentPlanInfoFullByName(orderId, true,function(err, schedule){
      console.log('schedule1', schedule)
      // console.log('err', err)
      commerceService.transactionList(orderId,function(err, transactions){
        // console.log('transactions', transactions)
        // console.log('err', err)
        schedule.schedulePeriods.forEach(function(element, index, array){
          element.transactions = [];
          if(transactions.length > 0){
            transactions.forEach(function(elemTransaction, ind, arrayTransation){
              if(elemTransaction.details.rawDetailsInfo.scheduleId === element.id ){
                element.transactions.push(elemTransaction);
              }
            });
          }
        });
        console.log('schedule2', schedule)
        console.log('schedule3', JSON.stringify(schedule, null, '\t'))
        done();
      });
    });
  });

});
