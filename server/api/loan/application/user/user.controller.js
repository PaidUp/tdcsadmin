'use strict';

var userService = require('./user.service');

exports.create = function(req, res) {
	userService.create(req.body, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};


exports.getUser = function(req, res, next) {
  var filter = {_id: req.body.id};
  userService.findOne(filter, function(err, userLoan) {
    if(err) return handleError(res, err);
    if (!userLoan) return res.status(404).json({
      "code": "ValidationError",
      "message": "User Id does not exist"
    });
    res.status(200).json(userLoan);
  });
};


// function handleError(res, err) {
//   var httpErrorCode = 500;
//   var errors = [];

//   if(err.name === "ValidationError") {
//     httpErrorCode = 400;
//   }

//   return res.json(httpErrorCode, {code : err.name, message : err.message, errors : err.errors});
// }
