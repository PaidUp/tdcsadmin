var _ = require('lodash');
var relationService = require('./relation.service');

exports.create = function(req, res, next) {
	relationService.create(req.body, function (err, data) {
		if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

exports.list = function(req, res, next) {
  relationService.list(req.params.id, function (err, data) {
  	if(err) res.status(402).json(402, err);
    res.status(200).json(data);
  });
};
