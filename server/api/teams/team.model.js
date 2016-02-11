'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamsSchema = new Schema({
  name: String,
  logo: String,
  info: String,
  city: String,
  state: String,
  country: String,
  active: Boolean
});

module.exports = mongoose.model('Teams', TeamsSchema);