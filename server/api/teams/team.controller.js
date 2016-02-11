'use strict';

var _ = require('lodash');
var teamService = require('./team.service');
var Team = require('./team.model');
var mongoose = require('mongoose');

exports.create = function(req, res) {
  var team = new Team(req.body);
  teamService.save(team, function(err, data) {
    if(err) return handleError(res, err);
    return res.status(200).json({teamId : data._id});
  });
};

// Get list of teams
exports.list = function(req, res, next) {
  teamService.find({},'-name -logo -info -city -state -country', function(err, teamFind) {
    if(err) return res.status(409).json(err);
    if(!teamFind){
      return res.status(404).json({
        "code": "AuthCredentialNotExists",
        "message": "team does not exists"
      });
    }
    res.status(200).json(teamFind);
  });
};

exports.load = function(req, res, next) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "teamId is required"
    });
  }
  var teamId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'_id':teamId};
  teamService.findOne(filter, function(err, teamFind) {
      if(err) return res.status(409).json(err);
      if(!teamFind){
        return res.status(404).json({
          "code": "AuthCredentialNotExists",
          "message": "Team does not exists"
        });
      }
      return res.status(200).json(teamFind);
    }
  );
};

exports.update = function(req, res, next) {
  var teamId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'_id':teamId};
  teamService.findOne(filter, function(err, teamFind) {
      if(err) return res.status(409).json(err);
      if(!teamFind){
        return res.status(404).json({
          "code": "AuthCredentialNotExists",
          "message": "Team does not exists"
        });
      }
      teamService.update(filter, req.body,function(err,data){
        if(err) return handleError(res, err);
        return res.send(200);
      });

    }
  );
};

exports.delete = function(req, res, next) {
  if(!req.params && !req.params.id) {
    return res.status(400).json({
      "code": "ValidationError",
      "message": "teamId is required"
    });
  }
  var teamId = mongoose.Types.ObjectId(req.params.id);
  var filter = {'_id':teamId};
  teamService.findOne(filter, function(err, teamFind) {
      if(err) return res.status(409).json(err);
      if(!teamFind){
        return res.status(404).json({
          "code": "AuthCredentialNotExists",
          "message": "team does not exists"
        });
      }
      teamService.remove(filter,function(err,data){
        if(err) return handleError(res, err);
        return res.sendStatus(200);
      });

    }
  );
};

function handleError(res, err) {
  return res.status(500).send(err);
}
