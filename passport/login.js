var LocalStrategy = require('passport-local').Strategy;
var User = require('models/user/model');

module.exports = function(passport) {

	passport.use('login', new LocalStrategy({
			passReqToCallback: true,
			usernameField: 'name'
		}, function(req, name, password, done) {

			User.findOne({
				$or: [{
					email: req.body.email
				}, {
					name: req.body.name
				}]
			}).exec(function(err, user) {
					if (err) {
						return done(err)
					}

					if (!user) {
						console.log("User not found with this name")
						return done(null, false, {
							message: 'User not found'
						})
					}

					user.comparePassword(password, function(err, isMatch) {
						if (isMatch) {
							return done(null, user, {
								message: 'Welcome back'
							})
						} else {
							return done(null, false, {
								message: 'Incorrect password'
							})
						}
					})

				})
	}))

}