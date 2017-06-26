var LocalStrategy = require('passport-local').Strategy;
var User = require('models/user/model')

module.exports = function(passport) {

	passport.use('signup', new LocalStrategy({

		passReqToCallback: true,
		usernameField: 'name',

	}, function(req, email, password, done) {

		findOrCreateUser = function() {

			if (!req.body.name) {
				return done(null, false, {
					message: 'Please choose a name'
				})
			} else if (!req.body.email) {
				return done(null, false, {
					message: 'Please enter your email'
				})
			}

			User.findOne({
				$or: [{
					email: req.body.email
				}, {
					name: req.body.name
				}]
			}, function(err, user) {
				if (err) {
					console.log("Error in signup")
					return done(err)
				}

				if (user) {
					console.log('User already exists')
					return done(null, false, {
						message: 'User already exists'
					})
				} else {
					var newUser = new User();


					for (var prop in req.body) {
						newUser[prop] = req.body[prop]
					}

					if (validatePassword(req.body.password)) {

						newUser.save(function(err) {
							if (err) {
								console.log("Error saving user")
								throw err
							}

							console.log("User saved successfully")

							newUser.createDefaultRoom(function() {

								return done(null, newUser, {
									message: 'Welcome'
								})

							})

						})
					} else {
						return done(null, false, {
							message: 'Password not valid format'
						})
					}
				}

			})
		};

		process.nextTick(findOrCreateUser);

	}))

}

var validatePassword = function(password) {

	var p = password;
	errors = [];

	if (p.length < 8) {
		errors.push("Your password must be at least 8 characters");
	}
	if (errors.length > 0) {
		return false;
	} else {
		return true;
	}

}