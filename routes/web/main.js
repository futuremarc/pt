var express = require('express');
var router = express.Router();
var User = require('models/user/model')
var Room = require('models/room/model')
var Subscription = require('models/subscription/model')

module.exports = function() {

  router.get('/', function(req, res, next) {

    if (req.user) {
      return res.render('auth/home.pug', {
        isLoggedIn: true,
        userName: req.user.name,
        userId: req.user._id
      })
    }


    //JUST TO PREVENT REFRESH - REMOVE FOR PRODUCTION

    // User.findOne({name:'marc'}, function(err, user) {
    //  if (err) {
    //    throw err
    //  }

    //   return res.render('auth/home.pug', {
    //     isLoggedIn: true,
    //     userName: user.name,
    //     userId: user._id
    //   })

    // })

    //TIL HERE

    Subscription.find({}).exec(function(err, result) {

      var subs = JSON.stringify(result)
      res.render('auth/signup.pug', {
        subscriptions: subs
      })

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
        isLoggedIn: true,
        userName: req.user.name,
        userId: req.user._id,
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
      isLoggedIn: true,
      userName: req.user.name,
      userId: req.user._id
    })

  })

  router.get('/suggestions', function(req, res, next) {

    if (!req.user) return res.render('auth/login.pug')

    res.render('auth/suggestions.pug', {
      isLoggedIn: true,
      userName: req.user.name,
      userId: req.user._id
    })

  })

  router.get('/feedback', function(req, res, next) {

    if (!req.user) return res.render('auth/feedback.pug')

    res.render('auth/feedback.pug', {
      isLoggedIn: true,
      userName: req.user.name,
      userId: req.user._id
    })

  })

  router.get('/room/:title', function(req, res, next) {

    var title = req.params.title

    Room.findOne({
      title: title
    }).exec(function(err, room) {

      if (!room) return

      var roomId = room.id
      var userName, userId
      var isLoggedIn = false

      if (req.user){
        userName = req.user.name
        userId = req.user._id
        isLoggedIn = true
      }

      res.render('auth/room.pug', {
        isLoggedIn: isLoggedIn,
        userName: userName,
        userId: userId,
        roomId: roomId
      })
    })
  })

  router.get('/room', function(req, res, next) {

    if (!req.user) return res.render('auth/login.pug')

    res.render('auth/room.pug', {
      isLoggedIn: true,
      userName: req.user.name,
      userId: req.user._id
    })

  })

  router.get('/list', function(req, res, next) {

    if (!req.user) return res.render('auth/login.pug')

    res.render('auth/list.pug', {
      isLoggedIn: true,
      userName: req.user.name,
      userId: req.user._id
    })

  })

  router.get('/list/:roomId', function(req, res, next) {

    var roomId = req.params.roomId

    Room.findOneById(roomId).exec(function(err, room) {

      var roomId = room.id
      var userName, userId
      var isLoggedIn = false

      if (req.user){
        userName = req.user.name
        userId = req.user._id
        isLoggedIn = true
      }

      res.render('auth/room.pug', {
        isLoggedIn: isLoggedIn,
        userName: userName,
        userId: userId,
        roomId: roomId
      })
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