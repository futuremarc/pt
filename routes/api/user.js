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

  router.route('/user/friend/request/:action')
    .post(function(req, res) {

      var friendId = req.body.friendId
      var userId = req.body.userId

      User
        .findByIdAndUpdate(friendId, {
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
    .put(function(req, res) {

      var friendId = req.body.friendId
      var userId = req.body.userId
      var action = req.params.action

      User
        .findByIdAndUpdate(userId, {
          $pull: {
            friendRequests: friendId
          }
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error deleting friend request"
            })
          }

          if (action !== 'accept') {
            return res.json({
              status: "success",
              data: user,
              message: "Rejected friend request"
            })
          }

          var data = {
            user: friendId,
            isFriend: true
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
                  message: "Error adding friend to user"
                })
              }

              var data = {
                user: userId,
                isFriend: true
              }

              User
                .findByIdAndUpdate(friendId, {
                  $addToSet: {
                    following: data
                  }
                })
                .exec(function(err, user) {
                  if (err) {
                    return res.json({
                      status: "error",
                      data: null,
                      message: "Error adding friend"
                    })
                  }

                  return res.json({
                    status: "success",
                    data: user,
                    message: "Added friend"
                  })
                })

            })

        })
    })

  router.route('/user/friend/:name')
    .post(function(req, res) {

    })

  .delete(function(req, res) {
      var friendId = req.params.id
      var userId = req.body.userId

      User
        .findByIdAndUpdate(userId, {
          $pull: {
            following: user.friendId
          }
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error deleting friend from user"
            })
          }

          return res.json({
            status: "success",
            data: user,
            message: "Friend removed from user"
          })

        })
      User
        .findByIdAndUpdate(friendId, {
          $pull: {
            following: user.userId
          }
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error deleting user from friend"
            })
          }

          return res.json({
            status: "success",
            data: user,
            message: "User removed from friend"
          })

        })

    })
    .get(function(req, res) {
      User
        .findById(req.params.id)
        .populate({
          path: 'followers',
          select: 'user subscriptions isFriend'
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error finding friends"
            })
          }

          return res.json({
            status: "success",
            data: user.followers,
            message: "User found"
          })
        })
    })

  router.route('/user/follow/:id')
    .post(function(req, res) {
      var subs = req.body.subscriptions
      var userId = req.body.userId
      var followId = req.params.id

      var data = {
        user: followId,
        subscriptions: subs
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
    .put(function(req, res) {

    })
    .delete(function(req, res) {

    })
    .get(function(req, res) {

    })

  router.route('/user/:name')
    .put(function(req, res) {
      User
        .findOne({
          name: req.params.name
        })
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
              message: "Updated user"
            })
          })
        })
    })
    .get(function(req, res) {
      User
        .findOne({
          name: req.params.name
        })
        .populate({
          path: 'friendRequests',
          select: 'name'
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error finding user"
            })
          }

          if (user) {
            return res.json({
              status: "success",
              data: user,
              message: "Found user"
            })
          } else {

            return res.json({
              status: "not found",
              data: user,
              message: "Couldn't find user"
            })
          }
        })
    })



  return router
}