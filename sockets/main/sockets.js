var clients = {}
var User = require('models/user/model')


module.exports = function(io) {


  io.on('connection', function(socket) {

    function broadcastToFriends(event, data) {

      var liveFriends = data.liveFriends

      for (var friend in liveFriends) {
        var socketId = clients[liveFriends[friend]]
        if (io.sockets.connected[socketId]) io.sockets.connected[socketId].emit(event, data);
      }
    }

    function emitToOne(event,data){

      console.log('emitToOne', event, data)

      var friendId = data.friendId
      var socketId = clients[friendId]

        if (io.sockets.connected[socketId]) io.sockets.connected[socketId].emit(event, data);

    }

    socket.on('join', function(data) { //store global associative list {userId : socketId}

      var id = data._id;
      var socketId = socket.id;

      if (!id) return

      clients[id] = socketId
      broadcastToFriends('join', data)

    })

    socket.on('leave', function(data) {

      var id = data._id;
      var socketId = socket.id;

      if (!id) return

      clients[id] = socketId
      broadcastToFriends('leave', data)

    })

    socket.on('friend', function(data) {

      var id = data._id;
      var socketId = socket.id;

      if (!id) return

      clients[id] = socketId
      emitToOne('friend', data)

    })

    var events = ['action', 'chat', 'post','request', 'friend']

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