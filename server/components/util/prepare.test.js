/**
 * Created by riclara on 4/13/15.
 */
'use strict';

var commerceService = require('../../api/commerce/commerce.service');
var loanService = require('../../api/loan/loan.service');
var loanApplicationService = require('../../api/loan/application/loanApplication.service');
var config = require('../../config/environment');
var fs = require('fs');


function asyncIterate(arr, pos, meth ,callback) {
  if(arr.length > 0){
    meth(arr[pos], function(err , data){
      if(err) return callback(err);

      if(++pos == arr.length){
        return callback(null, data);
      }

      asyncIterate(arr , pos, meth, callback);
    });
  }else{
    callback(null, true);
  }


}

function cancelOrder(order , cb){
  if(order){
    commerceService.orderCancel(order.incrementId,function(err , data){
      if(err) return cb(err);
      cb(null , true);
    });
  }
}

function cancelOrders(cb){
  commerceService.orderList({
    status : 'pending'
  }, function(err , orders){
    if(err) return cb(err);

    asyncIterate(orders, 0, cancelOrder, function(err , data){
      if(err) return cb(err);

      cb(null, true);
    });


  });
}

function cancelLoan(loan , cb){
  if(loan){
    loan.state = 'inactive';
    loanService.save(loan, function(err, data){
      if(err) return cb(err);
      cancelLoanApplication(data.applicationId, function(err1 ,data1){
        if(err1) return cb(err);
        return cb(null , true);
      });
    });
  }
}

function cancelLoans(cb){
  loanService.find({state : 'active'}, function(err , loans){
    if(err) return cb(err);

    asyncIterate(loans , 0, cancelLoan, function(err, data){
      if(err) return cb(err);
      cb(null, data);
    });
  });
}

function cancelLoanApplication(applicationId, cb){
  loanApplicationService.findOne(applicationId, function(err , loanApp){
    if(err) return cb(err);
    loanApp.state = 'CANCELED';
    loanApplicationService.save(loanApp, function(err, data){
      if(err) return cb(err);
    });
    return cb(null , true);
  });
}

function remove(cb){
  var file = config.root+'/var/cronjob.pid';
  fs.exists(file, function(exist){
    if(exist){
      fs.unlink(file, function (err) {
        if (err) return cb(err);
        cb(null, true);
      });
    }else{
      cb(null, true);
    }
  });
}


function prepareEnvironment(cb){
  cancelOrders(function(err, data){
    if(err) return cb(err);
    /*cancelLoans(function(err2 , data2){
      if(err2) {
        return cb(err2)
      }else{*/
        remove(function(errRem, passedRem) {
          if(errRem) return cb(errRem);
          cb(null, true);
        });
      /*}
    });*/
  });
}

exports.prepareEnvironment = prepareEnvironment;
