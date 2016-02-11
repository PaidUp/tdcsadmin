'use strict'

var tdPaymentPlanService = require('TDCore').paymentPlanService;
var config = require('../../../config/environment/index');
var logger = require('../../../config/logger');
//Done
function createPaymentPlanFull(params, cb){


  let paymentPlan = {
    name : params.orderId,
    destination : params.destinationId
  }

  let metadatas = [
    {name : 'org_name' , value : params.meta.org_name},
    {name : 'sku' , value : params.meta.sku},
    {name : 'athlete_first_name' , value : params.meta.athlete_first_name},
    {name : 'athlete_first_last' , value : params.meta.athlete_last_name}
  ]

  let schedules = [];

  //{schedule_data : {name : params.name, informations : []}}

  params.schedulePeriods.forEach(function (ele, idx, arr) {
    /*let attr = {
      id : ele.id,
      nextPayment : ele.nextPayment,
      nextPaymentDue : ele.nextPaymentDue,
      price : ele.price,
      percent : ele.percent,
      fee : ele.fee,
      feePercent : ele.feePercent,
      description : ele.description,
      discountToFee : ele.discountToFee
    };*/
    //NOTE: variable period is used for add this array data in all periods.
    let period = {name  : params.name,
      informations : [{name:'isCharged' , value : false}, {name:'accountId', value:params.accountId}]
    };

    for(var attributeName in ele){
      let scheduleInf = {
        name : attributeName,
        value : ele[attributeName]
      }

      period.informations.push(scheduleInf);
    }
    schedules.push(period);
  });

  paymentPlan.schedules = schedules;

  paymentPlan.metadatas = metadatas;

  logger.debug('scheduleService payment plan' , JSON.stringify(paymentPlan));

  tdPaymentPlanService.paymentPlanCreateFull(paymentPlan, function(err, data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanCreateFull', err);
      return cb(err);
    }
    logger.debug('tdPaymentPlanService.paymentPlanCreateFull' , data);
    cb(null, data);
  });
};
//Done
function paymentPlanInfoFullByName(name, isParse, cb){
  tdPaymentPlanService.paymentPlanInfoFullByName(name, isParse, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.getPaymentPlanFull', err);
      return cb(err);
    }else{
      logger.debug('tdPaymentPlanService.getPaymentPlanFull', data);
      return cb(null, data);
    }
  });
};
//Done
function paymentPlanList(filter, cb){
  tdPaymentPlanService.paymentPlanList(filter, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanList', err);
      return cb(err);
    }
    return cb(null, data);
  });
};
//Done
function paymentPlanDelete(paymentplanid, cb){
  tdPaymentPlanService.paymentPlanDelete(paymentplanid, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanDelete', err);
      return cb(err);
    }
    return cb(null, data);
  });
};
//Done
function paymentPlanInfoFull(paymentplanid, cb){
  tdPaymentPlanService.paymentPlanInfoFull(paymentplanid, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanInfoFull', err);
      return cb(err);
    }
    return cb(null, data);
  });
};
//Done
function paymentPlanInfo(paymentplanid, cb){
  tdPaymentPlanService.paymentPlanInfo(paymentplanid, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanInfo', err);
      return cb(err);
    }
    return cb(null, data);
  });
};
//Done
function paymentPlanUpdate(params, cb){
  //TODO validate mandatory fields
  tdPaymentPlanService.paymentPlanUpdate(params, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanUpdate', err);
      return cb(err);
    }
    return cb(null, data);
  });
};
//Done
function paymentPlanCreate(params, cb){
  tdPaymentPlanService.paymentPlanCreate(params, function (err , data){
    if(err){
      logger.error('tdPaymentPlanService.paymentPlanCreate', err);
      return cb(err);
    }
    return cb(null, data);
  });
};

function scheduleInformationUpdate(params , cb){
  tdPaymentPlanService.scheduleInformationUpdate(params, function(err , data){
    if(err){
      return cb(err);
    }
    cb(null, data);
  })
};

function scheduleInformationCreate(params , cb){
  tdPaymentPlanService.scheduleInformationCreate(params, function(err , data){
    if(err){
      return cb(err);
    }
    cb(null, data);
  })
};

module.exports = function(conf){
  if(conf){
    logger.debug('set new configuration' , conf);
    config = conf;
  }
  tdPaymentPlanService.init(config.connections.schedule);

  return {
    createPaymentPlanFull:createPaymentPlanFull,
    paymentPlanInfoFullByName:paymentPlanInfoFullByName,
    paymentPlanList: paymentPlanList,
    paymentPlanDelete: paymentPlanDelete,
    paymentPlanInfoFull: paymentPlanInfoFull,
    paymentPlanInfo: paymentPlanInfo,
    paymentPlanUpdate: paymentPlanUpdate,
    paymentPlanCreate: paymentPlanCreate,
    scheduleInformationUpdate: scheduleInformationUpdate,
    scheduleInformationCreate: scheduleInformationCreate
  }
}
