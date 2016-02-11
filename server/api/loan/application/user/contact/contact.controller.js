'use strict';

var _ = require('lodash');
var contactService = require('./contact.service');

exports.create = function(req, res, next) {
  contactService.create(req.body, function (err, data){
    if(err) res.status(402).json(err);
    res.status(200).json(data);
  });
};

// exports.list = function(req, res, next) {
//   var userId = req.user._id;
//   var userUpdate = req.params.id;
//   var filter = userId;
//   if(userUpdate != userId) {
//     filter = userUpdate;
//   }
//   contactService.findOneFilter({_id:filter},'-contacts.label -contacts.value', function(err, userFind) {
//     if(err) return res.json(409,res, err);
//     if(!userFind || filter != userFind.id){
//       return res.json(404,{
//         "code": "AuthCredentialNotExists",
//         "message": "User contact id does not exist"
//       });
//     }
//     res.json(200, userFind.contacts);
//   });
// };

// exports.load = function(req, res, next) {
//   var userId = req.user._id;
//   if(!req.params && !req.params.id) {
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Contact Id is required"
//     });
//   }
//   var idContact = mongoose.Types.ObjectId(req.params.id);
//   var filter = {'contacts.contactId':idContact};
//   contactService.findOneFilter(filter,{contacts: {$elemMatch: {'contactId': idContact}}}, function(err, userFind) {
//       if(err) return res.json(409,res, err);
//       if(!userFind){
//         return res.json(404,{
//           "code": "AuthCredentialNotExists",
//           "message": "Telephone does not exist"
//         });
//       }
//       return res.json(200,userFind.contacts[0]);
//     }
//   );
// };

// exports.update = function(req, res, next) {
//   var userId = req.user._id;
//   var userUpdate = req.body.userId;
//   if(!req.params && !req.params.id) {
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Contact Id is required"
//     });
//   }
//   var contacts = mongoose.Types.ObjectId(req.params.id);
//   var filter = {'contacts.contactId':contacts};
//   if(userUpdate != userId) {
//     filter = {createdBy : userId, _id:userUpdate,'contacts.contactId':contacts};
//   }

//   userService.findOne(filter, function(err, userFind) {
//       if(err) return res.json(409,res, err);
//       if(!userFind){
//         return res.json(404,{
//           "code": "AuthCredentialNotExists",
//           "message": "Telephone does not exist"
//         });
//       }
//       User.update(filter, {'$set': {'contacts.$.value': req.body.value}}, function(err, data){
//         if(err) return handleError(res, err);
//         res.send(200, {contactId:contacts});
//       });
//     }
//   );
// };

// exports.delete = function(req, res, next) {
//   var userId = req.user._id;
//   if(!req.params && !req.params.id) {
//     return res.json(400, {
//       "code": "ValidationError",
//       "message": "Contact Id is required"
//     });
//   }
//   var contactId = mongoose.Types.ObjectId(req.params.id);
//   var filter = {'contacts.contactId':contactId};
//   User.findOne(filter,{contacts: {$elemMatch: {'contactId': contactId}}}, function(err, userFind) {
//       if(err) return res.json(409,res, err);
//       if(!userFind){
//         return res.json(404,{
//           "code": "AuthCredentialNotExists",
//           "message": "Contact does not exists"
//         });
//       }
//       User.update(filter, { $pull: { "contacts" : { 'contactId': contactId} } },function(err,data){
//         if(err) return handleError(res, err);
//         return res.send(200);
//       });

//     }
//   );
// };
