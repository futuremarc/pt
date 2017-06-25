var express = require('express');
var app = express()
var router = express.Router();
var User = require('models/user/model')
var Friend = require('models/friend/model')
var async = require('async')
var mongoose = require('mongoose')
var ObjectId = require('mongoose').Types.ObjectId;


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {

  router.route('/users/friends/:id')
    .post(function(req, res) {

      var friendId = req.params.id
      var userId = req.body.userId

      User
        .findByIdAndUpdate(friendId, {
          $addToSet: {
            friendRequests: userId
          }
        })
        .populate('room')
        .populate('friends')
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

      var friendId = req.params.id
      var userId = req.body.userId
      var action = req.body.action

      User
        .findByIdAndUpdate(userId, {
          $pull: {
            friendRequests: friendId
          }
        }, {
          new: true
        })
        .populate('room friends')
        .exec(function(err, user) {

          if (err) {
            return res.json({
              status: "error",
              data: err,
              message: "Error deleting friend request"
            })
          }

          if (action === 'reject') {
            return res.json({
              status: "success",
              data: user,
              message: "Rejected friend request"
            })
          }

          var friend = Friend({
            user: friendId,
            friendOf: userId
          })

          friend.save(function(err, result) {

            friend.saveOtherFriend(function(err) {

              if (err) {
                return res.json({
                  status: "error",
                  data: null,
                  message: "Couldn't create friend"
                })
              }

              User
                .findById(userId)
                .populate('friendRequests room friends')
                .exec(function(err, user) {

                  if (err) {
                    return res.json({
                      status: "error",
                      data: err,
                      message: "Error adding friend to user"
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
    })

  .delete(function(req, res) {

    var friendId = req.params.id
    var userId = req.body.userId

    Friend
      .findOne({
        'user': friendId,
        'friendOf': userId
      }).exec(function(err, doc) {

        User.findById(userId)
          .populate('room friends')
          .exec(function(err, user) {
            if (err) {
              return res.json({
                status: "error",
                data: null,
                message: "Error removing friend from user"
              })
            }
            return res.json({
              status: "success",
              data: user,
              message: "Removed friend"
            })
          })

      })

  })

  router.route('/users/:id')
    .put(function(req, res) {

      var id = req.params.id;
      var $or = [{
        name: id
      }];

      if (ObjectId.isValid(id)) {
        $or.push({
          _id: ObjectId(id)
        });
      }

      User
        .findOne({
          $or: $or
        })
        .populate('room')
        .populate('friends')
        .exec(function(err, user) {
          if (err || !user) { //incase remote character wants to login to local
            return res.json({
              status: "error",
              data: null,
              message: "Error updating user"
            })
          }

          if (!req.body.subscriptions) req.body.subscriptions = [] //when empty array is passed over its lost for some reason

          for (var prop in req.body) {
            user[prop] = req.body[prop]
          }

          user.save(function(err, user) {

            if (err) {
              return res.json({
                status: "error",
                data: null,
                message: "Couldn't update user"
              })
            }

            if (!user) {
              return res.json({
                status: "not found",
                data: null,
                message: "Couldn't find user"
              })

            }

            return res.json({
              status: "success",
              data: user,
              message: "Updated user"
            })

          })
        })
    })
    .get(function(req, res) {

      var id = req.params.id;
      var $or = [{
        name: id
      }];

      if (ObjectId.isValid(id)) {
        $or.push({
          _id: ObjectId(id)
        });
      }

      User
        .findOne({
          $or: $or
        })
        .populate({
          path: 'friendRequests',
          select: 'name',
          populate: {
            path: 'friends',
            select:'user friendOf'
          }
        })
        .exec(function(err, user) {

          if (err) {
            return res.json({
              status: "error",
              data: null,
              message: "Error finding user"
            })
          }

          if (!user) {
            return res.json({
              status: "not found",
              data: null,
              message: "Couldn't find user"
            })

          }

          return res.json({
            status: "success",
            data: user,
            message: "Found user"
          })

        })
    })

  router.route('/users/live/')
    .get(function(req, res) {

      User
        .find({
          'isLive': true
        })
        .select('-password')
        .populate('room')
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find live users"
          })

          return res.json({
            status: "success",
            data: result,
            message: "Found live users"
          })

        })
    })

  router.route('/users/:id/suggestions')
    .get(function(req, res) {

      User
        .find({})
        .select('-password')
        .populate('room')
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find suggested users"
          })

          return res.json({
            status: "success",
            data: result,
            message: "Found suggested users"
          })

        })
    })


  router.route('/users/:name/friends/live')
    .get(function(req, res) {

      var name = req.params.name

      Friend
        .find({})
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: err,
            message: "Couldn't find live friends"
          })

          return res.json({
            status: "success",
            data: result,
            message: "Found live friends"
          })

        })
    })



  router.route('/users')
    .get(function(req, res) {

      User
        .find({})
        .select('-password')
        .populate('room')
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find users"
          })

          return res.json({
            status: "success",
            data: result,
            message: "Found users"
          })

        })
    })

  return router
}