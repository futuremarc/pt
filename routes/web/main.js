var express = require('express');
var router = express.Router();
var User = require('models/user/model')
var Subscription = require('models/subscription/model')

module.exports = function() {

  router.get('/', function(req, res, next) {

    if (!req.user) return res.render('auth/login.pug')

    return res.render('main/index.pug', {
      loggedIn: true,
      userName: req.user.name
    })

  })

  router.get('/login', function(req, res, next) {
    res.render('auth/login.pug')
  })

  router.get('/signup', function(req, res, next) {

    Subscription.find({}).exec(function(err, result) {

      var subs = JSON.stringify(result)
      res.render('auth/signup.pug', {
        subscriptions: subs
      })

    })

  })

  router.get('/settings', function(req, res, next) {

    if (!req.user) return res.render('auth/login.pug')

    Subscription.find({}).exec(function(err, result) {

      var subs = JSON.stringify(result)

      res.render('auth/settings.pug', {
        loggedIn: true,
        userName: req.user.name,
        subscriptions: subs
      })

    })

  })


  router.get('/logout', function(req, res, next) {
    req.logout()
    res.redirect(req.headers.referer)
  })

  router.get('/friend', function(req, res, next) {

    if (!req.user) return res.render('auth/login.pug')
    res.render('auth/friend.pug', {
        loggedIn: true,
        userName: req.user.name
      })

  })

  router.get('/forgot', function(req, res) {
    res.render('auth/forgot.pug', {
      user: req.user,
      expired: false
    })
  })

   router.get('/:anything', function(req, res) {
    res.redirect('/')
  })

  return router

}