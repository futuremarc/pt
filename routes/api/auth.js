var express = require('express');
var app = express()
var router = express.Router();
var User = require('models/user/model')
var async = require('async')
var sgTransport = require('nodemailer-sendgrid-transport')
var nodemailer = require('nodemailer')


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


  router.route('/feedback')
    .post(function(req, res) {

      var feedback = req.body.feedback
      var name = req.body.userName

      var html = '<div style="font-family:helvetica"><div style="font-size:15px"><p><b>' + name + '</b> says: "' + feedback + '"</p></div></div>'
      var mailer = nodemailer.createTransport(sgTransport(config.sendgrid))
      var mailOptions = {
        to: 'sirmarcus@gmail.com',
        from: 'feedback@passti.me',
        subject: name + ' has some feedback for Passtime!',
        html: html
      }
      mailer.sendMail(mailOptions, function(res) {
        console.log("SENDGRID RESPONSE", res)
      })

      return res.json({
        status: 'success',
        message: 'Thanks for your feedback'
      })

    })




  return router
}