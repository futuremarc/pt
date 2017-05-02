var express = require('express');
var app = express()
var router = express.Router();
var User = require('models/user/model')
var async = require('async')
var mongoose = require('mongoose')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {

  router.route('/user/friend/:action')
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
        }, {
          new: true
        })
        .exec(function(err, user) {
          if (err) {
            return res.json({
              status: "error",
              data: null,
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

          var data = {
            user: friendId
          }

          User
            .findByIdAndUpdate(userId, {
              $addToSet: {
                friends: data
              }
            }, {
              new: true
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
                user: userId
              }

              User
                .findByIdAndUpdate(friendId, {
                  $addToSet: {
                    friends: data
                  }
                }, {
                  new: true
                })
                .exec(function(err, friend) {
                  if (err) {
                    return res.json({
                      status: "error",
                      data: null,
                      message: "Error adding user to friend"
                    })
                  }

                  var friends = []

                  async.forEach(user.friends, function(friend, callback) {
                    User.populate(
                      friend, {
                        path: "user"
                      },
                      function(err, friend) {

                        friends.push(friend)
                        if (err) throw err;
                        callback();
                      }
                    );
                  }, function(err) {

                    if (err) return res.json({
                      status: "error",
                      data: null,
                      message: "Couldn't find friends of user"
                    })

                    user.friends = friends

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
    var friendId = req.body.friendId
    var userId = req.body.userId

    User
      .findByIdAndUpdate(userId, {
        $pull: {
          friends: {
            user: friendId
          }
        }
      }, {
        new: true
      })
      .exec(function(err, user) {
        if (err) {
          return res.json({
            status: "error",
            data: null,
            message: "Error removing friend from user"
          })
        }

        var friends = []

        async.forEach(user.friends, function(friend, callback) {
          User.populate(
            friend, {
              path: "user"
            },
            function(err, friend) {

              friends.push(friend)
              if (err) throw err;
              callback();
            }
          );
        }, function(err) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find friends of user"
          })

          user.friends = friends

          return res.json({
            status: "success",
            data: user,
            message: "Removed friend"
          })

        })

      })

    User
      .findByIdAndUpdate(friendId, {
        $pull: {
          friends: {
            user: userId
          }
        }
      })
      .exec(function(err, user) {
        if (err) {
          return res.json({
            status: "error",
            data: null,
            message: "Error removing user from friend"
          })
        }

      })


  })

  router.route('/user/friend/:name')
    .post(function(req, res) {

    })

  .get(function(req, res) {
    User
      .findById(req.params.id)
      .populate({
        path: 'friends',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name _id'
        }
      })
      .exec(function(err, user) {
        if (err) {
          return res.json({
            status: "error",
            data: null,
            message: "Error finding friends"
          })
        }

        var friends = []

        async.forEach(user.friends, function(friend, callback) {
          User.populate(
            friend, {
              path: "user"
            },
            function(err, friend) {

              friends.push(friend)
              if (err) throw err;
              callback();
            }
          );
        }, function(err) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find friends of user"
          })

          user.friends = friends

          return res.json({
            status: "success",
            data: user,
            message: "Found user"
          })

        })
      })
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

          user.save(function(err, user) {

            if (err) {
              return res.json({
                status: "error",
                data: null,
                message: "Couldn't update user"
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
      User
        .findOne({
          name: req.params.name
        })
        .populate({
          path: 'friendRequests',
          select: 'name',
          populate: {
            path: 'subscriptions'
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
              data: user,
              message: "Couldn't find user"
            })

          }

          var friends = []

          async.forEach(user.friends, function(friend, callback) {
            User.populate(
              friend, {
                path: "user"
              },
              function(err, friend) {

                friends.push(friend)
                if (err) throw err;
                callback();
              }
            );
          }, function(err) {

            if (err) return res.json({
              status: "error",
              data: null,
              message: "Couldn't find friends of user"
            })

            user.friends = friends

            return res.json({
              status: "success",
              data: user,
              message: "Found user"
            })

          })


        })
    })



  return router
}