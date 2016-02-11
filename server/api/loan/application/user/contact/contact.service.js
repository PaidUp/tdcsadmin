'use strict';

var tdUserService = require('TDCore').userService;
var config = require('../../../../../config/environment');

function create(data, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.contactCreate(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
};

// function validateTypeContactSync(contact) {
//   if(contact != 'telephone' && contact != 'email'){
//     return false;
//   }
//   return true;
// }

// function findOneFilter(filter,fields, cb) {
//   User.findOne(filter,fields, function(err, data) {
//       if(err) {
//         return cb(err);
//       }
//       return cb(null, data);
//     }
//   );
// }

// function validateTelephoneSync(telephone) {
//   if(typeof telephone != 'number'){
//   return false;
//   }
//   return true;
// }

exports.create = create;
// exports.validateTypeContactSync = validateTypeContactSync;
// exports.findOneFilter = findOneFilter;
// exports.validateTelephoneSync = validateTelephoneSync;