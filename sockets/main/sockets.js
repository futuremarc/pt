var clients = {}
var User = require('models/user/model')
var Message = require('models/message/model')
var Post = require('models/post/model')


module.exports = function(io) {


  io.on('connection', function(socket) {

    function broadcastToFriends(event, data) {

      console.log('broadcastToFriends', event, data)

      var liveFriends = data.liveFriends

      for (var friend in liveFriends) {
        var socketId = clients[liveFriends[friend]]
        if (io.sockets.connected[socketId]) io.sockets.connected[socketId].emit(event, data);
      }
    }

    function emitToOne(event, data) {

      var friendId = data.friendId
      var socketId = clients[friendId]

      console.log('emitToOne', data)

      if (io.sockets.connected[socketId]) {
        console.log('emitToOne', 'connected')
        io.sockets.connected[socketId].emit(event, data);
      }

    }

    socket.on('join', function(data) { //store global associative list {userId : socketId}

      if (!data) return

      var id = data._id;
      var socketId = socket.id;
      var friendId = data.friendId

      if (!id) return

      clients[id] = socketId
      broadcastToFriends('join', data)
      if (friendId) emitToOne('join', data)

    })

    socket.on('leave', function(data) {

      if (!data) return

      var id = data._id;
      var socketId = socket.id;
      var friendId = data.friendId

      if (!id) return

      clients[id] = socketId
      broadcastToFriends('leave', data)
      if (friendId) emitToOne('leave', data)

    })

    socket.on('friend', function(data) {

      var id = data._id;
      var socketId = socket.id;

      if (!id) return

      clients[id] = socketId
      emitToOne('friend', data)

    })

    socket.on('request', function(data) {

      var id = data._id;
      var socketId = socket.id;

      if (!id) return

      clients[id] = socketId
      emitToOne('request', data)

    })


    socket.on('joinRoom', function(data) {

      var room = data.room;
      socket.join(room)

    });


    socket.on('leaveRoom', function(data) {

      var room = data.room;
      socket.leave(room)

    });



    socket.on('chat', function(data) {

      var room = data.room
      var user = data.user._id
      var content = data.content

      socket.broadcast.to(room).emit('chat', data)

      //save msg to DB
      var message = Message({
        user: user,
        content: content,
        room: room
      })
      
      message.save(function(err, doc) {
        if (err) {
          console.log('cant save message', err)
        }
      })

    });

    socket.on('post', function(data) {


      console.log('POST', data)

      var room = data.room
      var user = data._id
      var url = data.post.url
      var contentId = data.post.contentId
      var title = data.post.title
      var type = data.post.type


     broadcastToFriends('post',data)
     socket.broadcast.to(room).emit('post', data)


      //add doc to mongo
      var post = Post({
        room: room,
        user: user,
        url: url,
        contentId: contentId,
        title: title,
        type: type
      })
      
      post.save(function(err, doc) {
        if (err) {
          console.log('cant save message', err)
        }
      })

    });


    socket.on('endPost', function(data) { //backgroundjs makes changes to mongo

      var room = data.room
  
     socket.broadcast.to(room).emit('endPost', data)

    });


    var events = ['action']

    events.forEach(function(event) {

      socket.on(event, function(data) {

        var id = data._id;
        var socketId = socket.id;

        if (!id) return

        clients[id] = socketId
        broadcastToFriends(event, data)
      })

    })


    socket.on('error', function(data) {
      console.log(data)
    })

  })

}