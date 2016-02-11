'use strict';

var logger = require('../../../config/logger');
var commerceService = require('../commerce.service');
var catalogService = require('../catalog/catalog.service');
var paymentService = require('../../payment/payment.service');
var commerceEmailService = require('../commerce.email.service');
var config = require('../../../config/environment');
//var mix = require('../../../config/mixpanel');
var userService = require('../../user/user.service');

exports.providerRequest = function (req, res) {
  var userId = req.user._id;
  commerceService.providerRequest(userId, req.body.providerInfo, function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    var userUpd = {_id:userId,'meta.providerStatus':'pending'};
    userService.save(userUpd, function(err, data){
      if (err) {
        return handleError(res, err);
      }
      commerceEmailService.sendContactEmail(provider, function(err, send){
        if(err){
          logger.info(err);
        }else{
          return res.status(200).json({providerId: provider._id});
        }
      });
      
    });
  });
}

exports.providerResponse = function (req, res) {
  var providerId = req.params.id;
  commerceService.providerResponse(providerId, 'pending', function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    if (!provider) {
      return res.status(200).json({});
    }
    var stripeInfo = {
      email:provider.ownerEmail,
      country:provider.country
    };
    paymentService.createConnectAccount(stripeInfo, function(err, account){
      if(err){
        //return handleError(res, err);
        return res.status(200).json({});
      }
      paymentService.addBankConnectAccount({accountId:account.id,bankAccount:{country:provider.country,routingNumber:provider.aba,accountNumber:provider.dda}}, function(err, bank){
        if(err){
          //return handleError(res, err);
          return res.status(401).json({});
        }
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.client.remoteAddress;
        var legalEntity={
          accountId:account.id,
          firstName:provider.ownerFirstName,
          lastName:provider.ownerLastName,
          day:provider.ownerDOB.getDay() + 1,
          month:provider.ownerDOB.getMonth() + 1,
          year:provider.ownerDOB.getFullYear(),
          type:config.payment.legalEntity.type,
          businessName:provider.businessName,
          last4:provider.ownerSSN.slice(-4),
          EIN:provider.EIN,
          line1:provider.Address,
          line2:provider.AddressLineTwo,
          city:provider.city || 'Austin',
          state:provider.state || 'Tx',
          postalCode:provider.zipCode,
          country:provider.country || 'US',
          personalIdNumber: provider.ownerSSN
        };
        paymentService.addToSCustomer({accountId:account.id, ip:ip}, function(err, acceptedToS){
          if(err){
            //return handleError(res, err);
            return res.status(401).json({});
          }
          paymentService.addLegalCustomer(legalEntity, function(err, acceptedLegal){
            var updateDrescriptor = {
              accountId:account.id,
              data:{
                statement_descriptor:provider.ownerFirstName+ ' ' + provider.ownerLastName
              }
            }
            paymentService.updateAccount(updateDrescriptor, function(err, descriptor){
            if(err){
              //return handleError(res, err);
              return res.status(401).json({});
            }

              if(err){
                //return handleError(res, err);
                return res.status(401).json({});
              }
              var productTeam = {
                type:config.commerce.products.defaultValue.type,
                set:config.commerce.products.defaultValue.set,
                sku:provider.ownerId,
                data: {
                  name:provider.teamName,
                  websites:[config.commerce.products.defaultValue.websites],
                  shortDescription:provider.businessName,
                  description:'',
                  status:config.commerce.products.defaultValue.status,
                  price:config.commerce.products.defaultValue.price,
                  taxClassId:config.commerce.products.defaultValue.taxClassId,
                  urlKey:config.commerce.products.defaultValue.urlKey,
                  urlPath:config.commerce.products.defaultValue.urlPath,
                  visibility:config.commerce.products.defaultValue.visibility,
                  categories:[config.commerce.category.teams],
                  categoryIds:[config.commerce.category.teams],
                  balancedCustomerId:account.id,
                  tdPaymentId:account.id
                }
              }
              catalogService.catalogCreate(productTeam, function(err, teamId){
                if(err){
                  //return handleError(res, err);
                  return res.status(402).json({});
                }
                commerceService.providerResponseUpdate(providerId, {verify:'done', aba:'', dda:'', ownerSSN:''}, function (err, providerData) {
                  if(err){
                    //return handleError(res, err);
                    return res.status(403).json({});
                  }
                  userService.find({_id:provider.ownerId},function(err , users){
                    if(err) return handleError(res, err);
                    var user = users[0];
                    user.meta.providerStatus = 'done';
                    user.meta.productRelated.push(teamId);
                    userService.save(user, function(err, data){
                      if (err) {
                        return handleError(res, err);
                      }
                      return res.status(200).json({});
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
    //return res.redirect('/');
  });
}

function handleError(res, err) {
  var httpErrorCode = 500;
  var errors = [];

  if(err.name === "ValidationError") {
    httpErrorCode = 400;
  }
  logger.log('error', err);

  return res.status(httpErrorCode).json({code : err.name, message : err.message, errors : err.errors});
}
