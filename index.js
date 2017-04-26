require('app-module-path').addPath(__dirname) //dont prefix require with ./

var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(5000, {
  path: '/socket'
})

if (app.get('env') === 'development') {
  var config = require('config/config-dev')
} else {
  var config = require('config/config')
}

var mongoose = require('mongoose')
mongoose.connect(config.mongodb)

var db = mongoose.connection

db.on('error', function(err) {
  console.log('connection error: ', err)
})

db.on('open', function() {
  console.log('connected to database')
})

var sockets = require('sockets/socket')(io)

var server = http.listen(8080, function() {
  console.log('listening on', server.address().port)
});