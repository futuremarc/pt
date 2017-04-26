var express = require('express');
var router = express.Router();

module.exports = function() {

  router.get('/', function(req, res, next) {
    res.render('landing/index.pug');
  })

  router.get('/login', function(req, res, next) {
    res.render('auth/login.pug')
  })

  router.get('/signup', function(req, res, next) {
    res.render('auth/signup.pug')
  })

  router.get('/extension', function(req, res, next) {
    res.render('extension/index.pug')
  })

  router.get('/forgot', function(req, res) {
    res.render('auth/forgot.pug', {
      user: req.user,
      expired: false
    })
  })

  return router

}