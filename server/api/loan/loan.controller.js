'use strict';

var loanService = require('./loan.service');
//var mix = require('../../config/mixpanel');
exports.simulate = function (req, res) {
	loanService.simulate(req.body, function (err, dataSimulate) {
		if (err) return res.status(409).json(err);
		res.status(200).json(dataSimulate);
	});
};

exports.create = function (req, res) {
  loanService.create(req.body, function (err, dataCreate) {
    if (err) return res.status(409).json(err);
    res.status(200).json(dataCreate);
  });
};

exports.getloan = function (req, res) {
  loanService.findOne(req.body, function (err, data) {
    if (err) return res.status(409).json(err);
    //mix.panel.track("getLoan", mix.mergeDataMixpanel(req.body, req.user._id));
    res.status(200).json(data);
  });
};
