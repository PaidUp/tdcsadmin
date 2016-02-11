'use strict'

var userService = require('../../user/user.service');
var paymentService = require('../payment.service');
//var cardService = require('./card.service');
var camelize = require('camelize');

exports.associate = function (req, res) {
  if(!req.body || !req.body.cardId){
    return res.status(400).json({
        "code": "ValidationError",
        "message": "Card id is missing"
      });
  }
  var cardId = req.body.cardId;
  var filter= {_id:req.user._id};
  userService.find(filter,function(err, dataUser){
    if(err){
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser[0], function(err, userPrepared){
      if(err){
          return handleError(res, err);
      }
      if(!userPrepared.meta.TDPaymentId){
      return res.status(400).json({
          "code": "ValidationError",
          "message": "user without TDPaymentId"
        });
      }

      paymentService.associateCard(userPrepared.meta.TDPaymentId, cardId, function(err, dataAssociate){
        if(err){
          return handleError(res, err);
        }
          return res.status(200).json(dataAssociate);
      });
    });
  });
};

exports.listCards = function(req, res){

  let userId = req.params.userId || req.user._id

  var filter= {_id:userId};
  userService.find(filter,function(err, dataUser){
    if(err){
      return handleError(res, err);
    }
    if(dataUser[0].meta.TDPaymentId !== ''){
      paymentService.listCards(dataUser[0].meta.TDPaymentId, function(errCard, dataCards){
        paymentService.fetchCustomer(dataUser[0].meta.TDPaymentId, function(errCustomer, dataCustomer){
          if(errCard || errCustomer){
            return res.status(400).json({
              "code": "ValidationError",
                "message": "customer Card is not valid"
            });
          }
          if(!dataCards){
            return res.status(400).json({
              "code": "ValidationError",
                "message": "User without cards"
            });
          }
          dataCards.defaultSource = dataCustomer.defaultSource
          return res.status(200).json(camelize(dataCards));
        });
      });
    } else{
      return res.status(200).json({data:[]});
    };
  });
}

exports.getCard = function(req, res){
	if(!req.params.id){
		return res.status(400).json({
			"code": "ValidationError",
      "message": "Card number is required"
    });
  }
  var filter= {_id:req.user._id};
	userService.find(filter,function(err, dataUser){
    if(err){
      return handleError(res, err);
    }
    paymentService.prepareUser(dataUser[0], function(err, userPrepared){
      if(err){
        return handleError(res, err);
      }
      if(!userPrepared.meta.TDPaymentId){
        return res.status(400).json({
          "code": "ValidationError",
          "message": "User without TDPaymentId"
        });
      }
      paymentService.fetchCard(req.params.id, function(err, dataCard){
        if(err){
          return res.status(400).json({
            "code": "ValidationError",
            "message": "Card is not valid"
          });
        }
        if(!dataCard){
          return res.status(400).json({
            "code": "ValidationError",
            "message": "User without Card"
          });
        }
        return res.status(200).json(camelize(dataCard));
      });
    });
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];
  if (err.name === "ValidationError" || err.code === "StripeCardError") {
    httpErrorCode = 400;
  }
  return res.status(httpErrorCode).json({
    code: err.type,
    message: err.message,
    errors: err.details
  });
}
