/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var emailService = require('../auth/auth.email.service');


// Creates a new thing in the DB.
exports.create = function(req, res) {
  emailService.sendWelcomeEmail({email:'jesse.cogollo@talosdigital.com',name:'sergio robledo'},function(cb){
    if(cb.err) return res.status(500).json(cb.err);
    return res.status(200).json(cb.success);
  });
};
