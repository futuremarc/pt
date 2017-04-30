require('app-module-path').addPath(__dirname) //dont prefix require with ./

var express = require('express')
var app = express()
var http = require('http').Server(app)
var path = require('path')
var favicon = require('serve-favicon')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var uuid = require('uuid');
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

//  user authentication
var passport = require('passport');
var session = require('express-session');

app.use(session({
  genid: function(req) {
    return uuid.v4();
  },
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('passport/init')
initPassport(passport);

var mongoose = require('mongoose')
mongoose.connect(config.mongodb)

var db = mongoose.connection

db.on('error', (err) => {
  console.log('db connection error: ', err)
})

db.on('open', () => {
  console.log('connected to db')
})

var subscriptions = require('models/subscription/init')()

var authRoutes = require('routes/auth/routes')(passport)
var apiAuthRoutes = require('routes/api/auth')(passport)
var apiUserRoutes = require('routes/api/user')()
var webMainRoutes = require('routes/web/main')(subscriptions);

app.use('/', webMainRoutes);
app.use('/', authRoutes)
app.use('/api', apiAuthRoutes)
app.use('/api', apiUserRoutes)

var mainSockets = require('sockets/main/sockets')(io)
var mobileSockets = require('sockets/mobile/sockets')(io)

var server = http.listen(8080, function() {
  console.log('listening on', this.address().port)
})