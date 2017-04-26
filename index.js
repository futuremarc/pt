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
  console.log('db connection error: ', err)
})

db.on('open', () => {
  console.log('connected to db')
})

const mainSockets = require('sockets/main/sockets')(io)
const mobileSockets = require('sockets/mobile/sockets')(io)
const extSockets = require('sockets/extension/sockets')(io)

const server = http.listen(8080, function() {
  console.log('listening on', this.address().port)
});


