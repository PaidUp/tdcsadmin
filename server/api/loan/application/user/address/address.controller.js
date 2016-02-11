'use strict';

var _ = require('lodash');
var addressService = require('./address.service');

exports.create = function(req, res, next) {
  addressService.create(req.body, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

// exports.list = function(req, res, next) {
//   var userId = req.user._id;
//   userService.findOneFilter(userId,'-addresses.address1 -addresses.address2 -addresses.label -addresses.value -addresses.address -addresses.city -addresses.state -addresses.country -addresses.zipCode', function(err, userFind) {
//     if(err) return res.json(409,res, err);
//     if(!userFind){
//       return res.json(404,{
//         "code": "AuthCredentialNotExists",
//         "message": "User Id does not exist"
//       });
//     }
//     res.json(200, userFind.addresses);
//   });
// };

// exports.load = function(req, res, next) {
//   var userId = req.user._id;
//   if(!req.params && !req.params.id) {
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Address Id is required"
//     });
//   }
//   var addressId = mongoose.Types.ObjectId(req.params.id);
//   var filter = {'addresses.addressId':addressId};
//   User.findOne(filter,{addresses: {$elemMatch: {'addressId': addressId}}}, function(err, userFind) {
//       if(err) return res.json(409,res, err);
//       if(!userFind){
//         return res.json(404,{
//           "code": "AuthCredentialNotExists",
//           "message": "Address does not exist"
//         });
//       }
//       return res.json(200,userFind.addresses[0]);
//     }
//   );
// };

// exports.update = function(req, res, next) {
//   var userId = req.user._id;
//   if(!req.params && !req.params.id) {
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Address Id is required"
//     });
//   }
//   var addressId = mongoose.Types.ObjectId(req.params.id);
//   var filter = {'addresses.addressId':addressId};
//   User.findOne(filter, function(err, userFind) {
//       if(err) return res.json(409,res, err);
//       if(!userFind){
//         return res.json(404,{
//           "code": "AuthCredentialNotExists",
//           "message": "Address does not exist"
//         });
//       }
//       User.update(filter, {'$set':
//         { 'addresses.$.label': req.body.label,
//           'addresses.$.address1': req.body.address1,
//           'addresses.$.address2': req.body.address2,
//           'addresses.$.city': req.body.city,
//           'addresses.$.state': req.body.state,
//           'addresses.$.country': req.body.country,
//           'addresses.$.zipCode': req.body.zipCode
//         }}, function(err, data){
//         if(err) return handleError(res, err);
//         res.send(200, {addressId:addressId});
//       });
//     }
//   );
// };

// exports.delete = function(req, res, next) {
//   var userId = req.user._id;
//   if(!req.params && !req.params.id) {
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Address Id is required"
//     });
//   }
//   var addressId = mongoose.Types.ObjectId(req.params.id);
//   var filter = {'addresses.addressId':addressId};
//   User.findOne(filter,{addresses: {$elemMatch: {'addressId': addressId}}}, function(err, userFind) {
//       if(err) return res.json(409,res, err);
//       if(!userFind){
//         return res.json(404,{
//           "code": "AuthCredentialNotExists",
//           "message": "Address does not exist"
//         });
//       }
//       User.update(filter, { $pull: { "addresses" : { 'addressId': addressId} } },function(err,data){
//         if(err) return handleError(res, err);
//         return res.send(200);
//       });

//     }
//   );
// };
