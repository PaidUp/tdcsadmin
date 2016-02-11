'use strict';

var userService = require('../../user/user.service');
var paymentService = require('../payment.service');
var bankService = require('./bank.service');
var camelize = require('camelize');

//TODO
/*
 For every API validate if user have TDPaymentId.
 if user not have TDPaymentId use method Prepared User.
*/

exports.create = function (req, res) {
  if (!req.body || !req.body.bankId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Bank id is required"
    });
  }
  var bankId = req.body.bankId;
  var filter = {
    _id: req.user._id
  };
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    //TODO validate dataUser


    paymentService.prepareUser(dataUser[0], function (err, userPrepared) {
      if (!userPrepared.meta.TDPaymentId) {
        return res.status(400).json({
          "code": "ValidationError",
          "message": "User without TDPaymentId"
        });
      }
      paymentService.associateBank(userPrepared.meta.TDPaymentId, bankId, function (err, dataAssociate) {
        if (err) {
          return handleError(res, err);
        }
        paymentService.createBankVerification(bankId, function (err, dataVerification) {
          if (err) {
            return handleError(res, err);
          }
          paymentService.setUserDefaultBank(userPrepared, function (err, data) {
            if (err) {
              return handleError(res, err);
            }
            return res.status(200).json({});
          });
        });
      });

    });
  });
};

exports.associate = function (req, res) {

  if (!req.body || !req.body.tokenId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "token is required"
    });
  }

  var token = req.body.tokenId;
  var filter = {
    _id: req.user._id
  };
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    //TODO validate dataUser
    paymentService.prepareUser(dataUser[0], function (err, userPrepared) {
      if (!userPrepared.meta.TDPaymentId) {
        return res.status(400).json({
          "code": "ValidationError",
          "message": "User without TDPaymentId"
        });
      }
      paymentService.associateBank(userPrepared.meta.TDPaymentId, token, function (err, dataAssociate) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(dataAssociate);
      });

    });
  });
};

exports.listBanks = function (req, res) {
  let userId = req.params.userId || req.user._id
  var filter = {
    _id: userId
  };
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    if(dataUser[0].meta.TDPaymentId  !== ''){

      paymentService.listBanks(dataUser[0].meta.TDPaymentId, function (err, dataBanks) {

        paymentService.fetchCustomer(dataUser[0].meta.TDPaymentId, function(errCustomer, dataCustomer){
          if(err || errCustomer){
            return res.status(400).json({
              "code": "ValidationError",
              "message": "customer Card is not valid"
            });
          }
          if(!dataBanks){
            return res.status(400).json({
              "code": "ValidationError",
              "message": "User without banks"
            });
          }
          dataBanks.defaultSource = dataCustomer.defaultSource
          return res.status(200).json(camelize(dataBanks));
        });
      });
    } else{
      return res.status(200).json({data:[]});
    };
  });
}

exports.verify = function (req, res) {
  var bankId = req.body.bankId;
  var deposit1 = req.body.deposit1;
  var deposit2 = req.body.deposit2;
  if (!bankId) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "bankId is required"
    });
  }
  bankService.verifyAmounts(deposit1, function (valid) {
    if (!valid) {
      return res.status(400).json({
        "code": "ValidationError",
        "message": "Deposit1 is not valid"
      });
    }
  });
  bankService.verifyAmounts(deposit2, function (valid) {
    if (!valid) {
      return res.status(400).json({
        "code": "ValidationError",
        "message": "Deposit2 is not valid"
      });
    }
  });
  var filter = {
    _id: req.user._id
  };
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser[0], function (err, userPrepared) {
      if (!userPrepared.meta.TDPaymentId) {
        return res.status(400).json({
          "code": "ValidationError",
          "message": "User without TDPaymentId"
        });
      }
      paymentService.confirmBankVerification(userPrepared.meta.TDPaymentId, bankId, deposit1, deposit2, function (err, data) {
        if(err){
         return res.status(500).json({
           "code": "ValidationError",
           "message": err.error.message
         });
       } else {
         return res.status(200).json(data);
       }
    });
  });
  }
  )};

exports.pending = function (req, res) {
  var filter = {
    _id: req.user._id
  };
  userService.findOne(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser, function (err, userPrepared) {
      if (!userPrepared.meta.TDPaymentId) {
        return res.status(400).json({
          "code": "ValidationError",
          "message": "user without TDPaymentId"
        });
      }
      paymentService.listBanks(req.user.meta.TDPaymentId, function (err, dataBanks) {
        if (err) {
          return res.status(400).json({
            "code": "ValidationError",
            "message": "Error banks"
          });
        }
        if (!dataBanks) {
          return res.status(400).json({
            "code": "ValidationError",
            "message": "user without Banks"
          });
        }
        dataBanks.forEach(function (bank) {

        });
      });
    });
  });
}

exports.getBank = function (req, res) {
  if (!req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "Bank id is required"
    });
  }
  var filter = {
    _id: req.user._id
  };
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser[0], function (err, userPrepared) {
      if (!userPrepared.meta.TDPaymentId) {
        return res.status(400).json({
          "code": "ValidationError",
          "message": "User without TDPaymentId"
        });
      }

      paymentService.fetchBank(req.params.id, function (err, dataBank) {
        if (err) {
          return res.status(400).json({
            "code": "ValidationError",
            "message": "Bank is not valid"
          });
        }
        if (!dataBank) {
          return res.status(400).json({
            "code": "ValidationError",
            "message": "User without Bank"
          });
        }
        return res.status(200).json(camelize(dataBank));
      });

    });
  });
}

exports.deleteBankAccount = function(req, res){
  paymentService.deleteBankAccount(req.params.customerId, req.params.bankId, function(err, data){
    if (err) {
      return res.status(400).json({
        "code": "ValidationError",
        "message": "Bank is not valid"
      });
    }

    return res.status(200).json({});

  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if (err.name === "ValidationError") {
    httpErrorCode = 400;
  }

  return res.status(httpErrorCode).json({
    code: err.name,
    message: err.message,
    errors: err.errors
  });
}
