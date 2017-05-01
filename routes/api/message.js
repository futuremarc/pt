var express = require('express');
var app = express()
var router = express.Router();
var Message = require('models/message/model')
var async = require('async')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {

  return router
}