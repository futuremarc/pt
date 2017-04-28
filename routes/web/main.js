var express = require('express');
var router = express.Router();
var User = require('models/user/model')

module.exports = function(subscriptions) {

  router.get('/', function(req, res, next) {

    if (!req.user) return res.render('main/index.pug')

    return res.render('main/index.pug', {
      loggedIn: true,
      userName: req.user.name
    })

  })

  router.get('/login', function(req, res, next) {
    res.render('auth/login.pug')
  })

  router.get('/signup', function(req, res, next) {

    var subs = JSON.stringify(subscriptions)

    res.render('auth/signup.pug', {
      subscriptions: subs
    })
  })

  router.get('/logout', function(req, res, next) {
    res.render('auth/logout.pug')
  })

  router.get('/follow', function(req, res, next) {
    res.render('auth/follow.pug')
  })

  router.get('/forgot', function(req, res) {
    res.render('auth/forgot.pug', {
      user: req.user,
      expired: false
    })
  })

  return router

}