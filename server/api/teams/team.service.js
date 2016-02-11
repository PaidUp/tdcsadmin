'use strict';

var Team = require('./team.model');

function save(user, cb) {
  user.save(function(err, data) {
    if(err) {
      return cb(err);
    }
    return cb(null, data);
  });
}

function find(filter,fields, cb) {
  Team.find(filter,fields, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function findOne(filter, cb) {
  Team.findOne(filter, function(err, data) {
      if(err) {
        return cb(err);
      }
      return cb(null, data);
    }
  );
}

function update(filter, team, cb) {
  	Team.update(filter,team, function(err, data) {
      	if(err) {
        	return cb(err);
      	}
      	return cb(null, data);
    });
}

function remove(id, cb) {
  	Team.remove(id, function(err, data) {
      	if(err) {
        	return cb(err);
      	}
      	return cb(null, data);
    });
}

exports.save = save;
exports.find = find;
exports.findOne = findOne;
exports.update = update;
exports.remove = remove;