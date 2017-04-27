var express = require('express');
var app = express()
var router = express.Router();
var User = require('models/user/model')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {
  
  router.route('/signup')
    .post(function(req, res, next) {
      console.log('REQ..', req.body)
      passport.authenticate('signup', function(err, user, info) {

        console.log('signup', arguments)

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


  return router
}