'use strict';

// var app = require('../../app');
// var request = require('supertest');
var assert = require('chai').assert;
var scheduleService = require("./schedule.service")();

describe('schedule.service', function() {
  let result = {}
  it('payment Plan Create', function (done) {
    let data = {name:'testName', destination:'destinationTest'}
    scheduleService.paymentPlanCreate(data,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.paymentPlanId)
      result.paymentPlanId = data.paymentPlanId
      done();
    });
  });

  it('payment Plan Update', function (done) {
    let param = {paymentPlanId:result.paymentPlanId,
                    paymentPlanData: {
                      name:'testNameUpdate',
                      destination:'destinationTestUpd'
                    }
                };
    scheduleService.paymentPlanUpdate(param,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.updated)
      done();
    });
  });

  it('payment Plan Info', function (done) {
    let ppId = result.paymentPlanId
    scheduleService.paymentPlanInfo(ppId,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.entityId)
      assert.isNotNull(data.name)
      assert.isNotNull(data.destination)
      done();
    });
  });

  it('payment Plan Info Full', function (done) {
    let ppId = result.paymentPlanId
    scheduleService.paymentPlanInfoFull(ppId,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.entityId)
      assert.isNotNull(data.name)
      assert.isNotNull(data.destination)
      assert.isNotNull(data.metadatas)
      assert.isNotNull(data.schedules)
      done();
    });
  });

  it('payment Plan List', function (done) {
    scheduleService.paymentPlanList({},function(err, data){
      assert.isNotNull(data)
      done();
    });
  });

  it('payment Plan Delete', function (done) {
    let ppId = result.paymentPlanId
    scheduleService.paymentPlanDelete(ppId,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.deleted)
      done();
    });
  });

  it('payment Plan Create Full', function (done) {
    let params = {}
    params.meta = {}
    params.meta.org_name = 'org_name'
    params.meta.sku = 'sku'
    params.meta.athlete_first_name = 'athlete_first_name'
    params.meta.athlete_last_name = 'athlete_last_name'
    params.orderId = 'orderId'
    params.destinationId = 'destinationId'
    params.schedules = []
    params.metadatas = []
    params.schedulePeriods = []
    scheduleService.createPaymentPlanFull(params,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.paymentPlanId)
      result.paymentPlanFullid = data.paymentPlanId
      done();
    });
  });

  it('payment Plan Info', function (done) {
    let ppId = result.paymentPlanFullid
    scheduleService.paymentPlanInfo(ppId,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.entityId)
      assert.isNotNull(data.name)
      assert.isNotNull(data.destinationId)
      result.paymentPlanFullName = data.name
      done();
    });
  });

  it('payment Plan Info Full', function (done) {
    let name = result.paymentPlanFullName
    scheduleService.paymentPlanInfoFullByName(name, true,function(err, data){
      assert.isNotNull(data)
      assert.isNotNull(data.destinationId)
      done();
    });
  });

});
