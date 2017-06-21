var express = require('express');
var app = express()
var router = express.Router();
var Post = require('models/post/model')
var async = require('async')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {

  router.route('/posts/:id')
    .get(function(req, res) {

    })

  return router
}