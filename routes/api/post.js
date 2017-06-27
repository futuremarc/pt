var express = require('express');
var app = express()
var router = express.Router();
var Post = require('models/post/model')
var Room = require('models/room/model')
var async = require('async')
var ObjectId = require('mongoose').Types.ObjectId;



if (app.get('env') === 'development') {
  var config = require('config/config-dev');
} else {
  var config = require('config/config');
}

module.exports = function(passport) {



  router.route('/posts')
    .get(function(req, res) {

      Post
        .find({})
        .exec(function(err, result) {

          if (err) return res.json({
            status: "error",
            data: null,
            post: "Couldn't find posts"
          })

          return res.json({
            status: "success",
            data: result,
            post: "Found posts"
          })

        })
    })


  .post(function(req, res) {

    var post = Post()

    for (var prop in req.body) {
      post[prop] = req.body[prop]
    }

    post.save(function(err, doc) {

      if (err) {
        return res.json({
          status: "error",
          data: null,
          post: "Problem creating post",
          err: err
        })
      }

      return res.json({
        status: "success",
        data: doc,
        post: "post created"
      })
    })

  })


  router.route('/posts/:id')
  .get(function(req, res) {

    var id = req.params.id

    Post
      .findById(id)
      .exec(function(err, post) {

        if (err) return res.json({
          status: "error",
          data: null,
          post: "Couldn't find post"
        })

        return res.json({
          status: "success",
          data: post,
          post: "Found posts"
        })

      })
  })

  .put(function(req, res) {

    var id = req.params.id

    Post
      .findById(id)
      .exec(function(err, post) {

        if (!post) return res.json({
          status: "error",
          data: null,
          post: "Couldn't find post"
        })

        for (var prop in req.body) {
          post[prop] = req.body[prop]
        }

        post.save(function(err) {

          if (err) return res.json({
            status: "error",
            data: null,
            post: "Couldn't update post"
          })

          return res.json({
            status: "success",
            data: post,
            post: "updated post"
          })
        })

      })
  })


  router.route('/posts/room/:id/end') //end whatever post is live in the room

  .put(function(req, res) {

    var id = req.params.id

    Room
      .findById(id)
      .exec(function(err, room) {

        if (err) return res.json({
          status: "error",
          data: err,
          post: "Couldn't end post"
        })

          Post.findByIdAndUpdate(room.livePost, {
            $set: {
              isLive: false
            }
          }, {
            new: true
          }).exec(function(err, post) {

            room.livePost = undefined
            room.save(function(err) {

              if (err) return res.json({
                status: "error",
                data: err,
                post: "Couldn't end post"
              })

              return res.json({
                status: "success",
                data: post,
                post: "Ended post"
              })
            })
          })
      })
  })



  router.route('/posts/room/:id')

  .get(function(req, res) {

    var id = req.params.id

    if (!ObjectId.isValid(id)) {

      var $or = [{
        'user.name': id
      }];

    } else if (ObjectId.isValid(id)) {

      $or.push({
        _id: ObjectId(id)
      });

    }

    Room.findOne({
        $or: $or
      })
      .exec(function(err, result) {

        if (err) return res.json({
          status: "error",
          data: null,
          post: "Couldn't find post"
        })

        return res.json({
          status: "success",
          data: result,
          post: "Found posts"
        })

      })
  })
  return router
}