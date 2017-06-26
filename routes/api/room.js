var express = require('express');
var app = express()
var router = express.Router();
var Room = require('models/room/model')
var User = require('models/user/model')
var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId;


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {


  router.route('/rooms')
    .get(function(req, res) {

      Room
        .find({})
        .populate('user posts')
        .populate({
          path: 'messages',
          populate: {
            path: 'user',
            select: 'name'
          }
        })
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find rooms"
          })

          return res.json({
            status: "success",
            data: result,
            message: "Found rooms"
          })

        })
    })


  .post(function(req, res) {

    var userId = req.body.userId
    var title = req.body.title

    var room = Room({
      user: userId,
      title: title
    })

    room.save(function(err, result) {

      if (err) {
        return res.json({
          status: "error",
          data: null,
          message: "Problem creating room",
          err: err
        })
      }

      return res.json({
        status: "success",
        data: result,
        message: "Room created"
      })
    })

  })


  router.route('/rooms/:id')

  .get(function(req, res) {

    
      var id = req.params.id;

      var $or = [{
        title: id
      }];

      if (ObjectId.isValid(id)) {
        $or.push({
          _id: ObjectId(id)
        });
      }

    Room.findOne({
          $or: $or
        })
      .populate({
        path: 'messages',
        populate: {
          path: 'user'
        }
      }).populate('posts')
      .exec(function(err, doc) {

        if (err) return res.json({
          status: "error",
          data: null,
          message: "Couldn't find room"
        })

        return res.json({
          status: "success",
          data: doc,
          message: "Found room"
        })

      })
  })


  router.route('/rooms/users/:id')

  .get(function(req, res) {

    var id = req.params.id

    Room
      .findOne({
        user: id
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'user'
        }
      }).populate('posts')
      .exec(function(err, doc) {

        if (err) return res.json({
          status: "error",
          data: null,
          message: "Couldn't find room"
        })

        return res.json({
          status: "success",
          data: doc,
          message: "Found room"
        })

      })
  })


  return router
}