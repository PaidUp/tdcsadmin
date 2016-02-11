'use strict';

var tdUserService = require('TDCore').userService;
var config = require('../../../../../config/environment');

function create (data, cb) {
  tdUserService.init(config.connections.userLoan);
  tdUserService.addressCreate(data, data.userId, function (err, data){
    if(err) return cb(err);
    return cb(null, data);
  });
}

// function validateTypeAddressSync(contact) {
//   if(contact != 'shipping' && contact != 'billing' && contact != 'other' && contact != 'loan'){
//     return false;
//   }
//   return true;
// }

exports.create = create;
// exports.validateTypeAddressSync = validateTypeAddressSync;