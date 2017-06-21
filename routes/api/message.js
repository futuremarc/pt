var express = require('express');
var app = express()
var router = express.Router();
var Message = require('models/message/model')
var Room = require('models/room/model')
var async = require('async')


if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {



  router.route('/messages')
    .get(function(req, res) {

      Message
        .find({})
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: null,
            message: "Couldn't find messages"
          })

          return res.json({
            status: "success",
            data: result,
            message: "Found messages"
          })

        })
    })


  .post(function(req, res) {

    var userId = req.body.userId
    var roomId = req.body.roomId
    var content = req.body.content


    var message = Message({
      user: userId,
      content: content,
      room: roomId
    })

    message.save(function(err, doc) {

      if (err) {
        return res.json({
          status: "error",
          data: null,
          message: "Problem creating message",
          err: err
        })
      }

      return res.json({
        status: "success",
        data: doc,
        message: "message created"
      })
    })

  })



  router.route('/messages/:id')

  .get(function(req, res) {

    var id = req.params.id

    Message
      .findById(id)
      .exec(function(err, result) {

        if (err) return res.json({
          status: "error",
          data: null,
          message: "Couldn't find message"
        })

        return res.json({
          status: "success",
          data: result,
          message: "Found messages"
        })

      })
  })

  router.route('/messages/room/:id')

  .get(function(req, res) {

    var id = req.params.id

    Message
      .find({
        'room': id
      })
      .exec(function(err, result) {

        if (err) return res.json({
          status: "error",
          data: null,
          message: "Couldn't find message"
        })

        return res.json({
          status: "success",
          data: result,
          message: "Found messages"
        })

      })
  })


  return router
}