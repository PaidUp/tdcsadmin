/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');

User.find({}).remove(function() {
  User.create({
    lastName: 'cs seed',
    firstName: 'seed cs',
    email: 'email@email.com',
    password: 'Qwerty1!'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'email@email.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
