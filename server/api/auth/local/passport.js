var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userService = require('../../user/user.service');

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      userService.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, {
            "code": "PermissionDenied",
            "message": "You don't have permission for this operation"
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            "code": "PermissionDenied",
            "message": "You don't have permission for this operation"
          });
        }
        return done(null, user);
      });
    }
  ));
};
