require('app-module-path').addPath(__dirname) //dont prefix require with ./

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(5050, {
  path: '/socket'
})

if (app.get('env') === 'development') {
  var config = require('config/config-dev')
} else {
  var config = require('config/config')
}

const mongoose = require('mongoose')
mongoose.connect(config.mongodb)

const db = mongoose.connection

db.on('error', (err) => {
  console.log('connection error: ', err)
})

db.on('open', () => {
  console.log('connected to database')
})

const sockets = require('sockets/socket')(io)

const server = http.listen(8080, function() {
  console.log('listening on', this.address().port)
});