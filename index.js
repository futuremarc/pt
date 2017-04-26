require('app-module-path').addPath(__dirname) //dont prefix require with ./

var express = require('express')
var app = express()
var http = require('http').Server(app)
var path = require('path')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var fs = require('fs')
var passport = require('passport')
var io = require('socket.io')(5050, {
  path: '/socket'
})

if (app.get('env') === 'development') {
  var config = require('config/config-dev')
} else {
  var config = require('config/config')
}

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')))
app.use(favicon(path.join(__dirname, '/public/img/brand', 'favicon.ico')))

var mongoose = require('mongoose')
mongoose.connect(config.mongodb)

var db = mongoose.connection

db.on('error', (err) => {
  console.log('db connection error: ', err)
})

db.on('open', () => {
  console.log('connected to db')
})

var authRoutes = require('routes/auth/routes')(passport)
var apiAuthRoutes = require('routes/api/auth')(passport)
var webMainRoutes = require('routes/web/main')();

app.use('/', webMainRoutes);
app.use('/', authRoutes)
app.use('/api', apiAuthRoutes)

var landingSockets = require('sockets/landing/sockets')(io)
var mobileSockets = require('sockets/mobile/sockets')(io)
var extSockets = require('sockets/extension/sockets')(io)

var server = http.listen(8080, function() {
  console.log('listening on', this.address().port)
})


