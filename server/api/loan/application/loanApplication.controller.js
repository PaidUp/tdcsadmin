'use strict';

var loanApplicationService = require('./loanApplication.service');
var userService = require('./user/user.service');
//var mix = require('../../../config/mixpanel');

exports.simulate = function(req, res) {
  loanApplicationService.simulate(req.body, function (err, dataSimulate) {
    if (err) return res.status(409).json(err);
    //mix.panel.track("simulateAppLoan", mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(dataSimulate);
  });
};

exports.create = function(req, res) {
  req.body.userId = req.user._id;
  loanApplicationService.create(req.body, function (err, data){
  	if (err) return res.status(409).json(err);
  	//mix.panel.track("createAppLoan", mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(data);
  });
};

exports.state = function(req, res) {
   loanApplicationService.state(req.body, function (err, data){
     if (err) return res.status(409).json(err);
     //mix.panel.track("stateAppLoan", mergeDataMixpanel(req.body, req.user._id));
     res.status(200).json(data);
   });
};

exports.sign = function(req, res) {
  if (req.user) {
    req.body.applicantUserId = req.user._id;
    //mix.panel.track("signAppLoan", mergeDataMixpanel(req.body, req.user._id));
  }
  userService.sign(req.body, function (err, sign){
    if (err) return res.status(409).json(err);
    if (sign.isCorrect) {
      loanApplicationService.sign(req.body, function (err, data){
        if (err) return res.status(409).json(err);
        res.status(200).json(data);
      });
    }else {
      res.status(400).json({
        "code": "ValidationError",
        "message": "sign is not accepted"
      });
    }
  });
};

exports.payment = function(req, res) {
  loanApplicationService.payment(req.body, function (err, data){
    if (err) return res.status(409).json(err);
    //mix.panel.track("paymentAppLoan", mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(data);
  });
};

exports.application = function(req, res) {
  loanApplicationService.findOne(req.params.id, function (err, applicationData){
     if(!applicationData){
       return res.status(400).json({
         "code": "ValidationError",
         "message": "loan Application not exist."
       });
    };
  res.status(200).json(applicationData);
  });
};

exports.getcontract = function (req, res) {
  req.body.userId = req.user._id;
  loanApplicationService.contract(req.body, function (err, data){
    if (err) return res.status(409).json(err);
    res.status(200).json(data);
  });
};

function mergeDataMixpanel(data, userId){
  //return mix.mergeDataMixpanel(data, userId);
}
