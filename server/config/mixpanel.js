'use strict';
var key = require('./environment').mixpanel.apiKey;
var mixPanel = require('mixpanel');
var panel = mixPanel.init(key);
//for register users in mixpanel, revise file auth.service.

function mergeDataMixpanel(data, userId){
  if(data){
    var merge = data;
    merge.distinct_id = userId;
    return merge;
  }
}

exports.panel = panel;
exports.mergeDataMixpanel = mergeDataMixpanel;
