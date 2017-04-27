var login = require('passport/login');
var signup = require('passport/signup');
var User = require('models/user/model')

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	
	passport.deserializeUser(function(id, done) {
			User.findById(id, function(err, user) {
				done(err, user)
			})
	});

	// authentication strategies
	login(passport);
	signup(passport);
}