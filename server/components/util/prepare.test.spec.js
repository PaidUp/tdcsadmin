/**
 * Created by riclara on 4/13/15.
 */

var app = require('../../app');
var prepareTest = require('./prepare.test');

describe.skip('init test', function(){
  it('prepare test', function(done){
    this.timeout(160000);
    //this.timeout(60000);
    prepareTest.prepareEnvironment(function(err, data){
      return done();
    });
  });
})


