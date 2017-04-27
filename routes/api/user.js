var express = require('express');
var app = express()
var router = express.Router();
var User = require('models/user/model')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {

  router.route('/user/:id')
    .put(function(req, res) {
      User
        .findById(req.params.id)
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error updating user"
            })
          }

          for (var prop in req.body) {
            user[prop] = req.body[prop]
          }

          user.save(function(err) {
            return res.json({
              status: "success",
              data: user,
              message: "User updated"
            })
          })
        })
    })
    .get(function(req, res) {
      User
        .findOne({
          name: req.body.name
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error finding user"
            })
          }

          return res.json({
            status: "success",
            data: user,
            message: "User found"
          })
        })
    })


  router.route('/friend/:id')
    .put(function(req, res) {
      var friendId = req.params.id
      var userId = req.body.userId

      User
        .findByIdAndUpdate(friendId, 
        {
          $addToSet: {
            friendRequests: userId
          }
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error requesting friend"
            })
          }

          return res.json({
            status: "success",
            data: user,
            message: "Friend request sent"
          })
        })
    })

  router.route('/follow/:id')
    .put(function(req, res) {
      var subs = req.body.subscriptions
      var userId = req.body.userId
      var followId = req.params.id

      var data = {
        user : followId,
        subscriptions : subs
      }

      User
        .findByIdAndUpdate(userId, {
          $addToSet: {
            following: data
          }
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error following user"
            })
          }

          return res.json({
            status: "success",
            data: user,
            message: "Following user"
          })
        })
    })


  return router
}