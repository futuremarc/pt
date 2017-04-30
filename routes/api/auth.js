var express = require('express');
var app = express()
var router = express.Router();
var User = require('models/user/model')
var async = require('async')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {

  router.route('/signup')
    .post(function(req, res, next) {
      passport.authenticate('signup', function(err, user, info) {
        if (err) {
          return next(err)
        }

        if (!user) {
          return res.json({
            status: "error",
            message: info.message
          })
        }

        req.login(user, function(err) {
          if (err) {
            return next(err)
          }

          return res.json({
            status: "success",
            message: info.message,
            data: user
          })
        })
      })(req, res, next)

    })

  router.route('/login')
    .post(function(req, res, next) {

      passport.authenticate('login', function(err, user, info) {
        if (err) {
          return next(err)
        }

        if (!user) {
          return res.json({
            status: "error",
            message: info.message,
            val: req.body
          })
        }

        var friends = []

        async.forEach(user.friends, function(friend, callback) {
          User.populate(
            friend, {
              path: "user"
            },
            function(err, friend) {

              friends.push(friend)
              if (err) throw err;
              callback();
            }
          );
        }, function(err) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't sign up"
          })

          user.friends = friends


          req.login(user, function(err) {
            if (err) {
              return next(err)
            }

            return res.json({
              status: "success",
              message: info.message,
              data: user
            })
          })
        })


      })(req, res, next);
    })

  router.route('/logout')
    .get(function(req, res) {
      req.logout();
      res.json({
        status: "success",
        message: "logout successful"
      })
    })


  return router
}