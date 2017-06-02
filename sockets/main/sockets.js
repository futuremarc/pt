var clients = {}
var User = require('models/user/model')


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

    function emitToOne(event, data){

      var friendId = data.friendId
      var socketId = clients[friendId]

      console.log('emitToOne', data)
  
        if (io.sockets.connected[socketId]){
                console.log('emitToOne', 'connected')
          io.sockets.connected[socketId].emit(event, data);
        }

    }

    socket.on('join', function(data) { //store global associative list {userId : socketId}

      var id = data._id;
      var socketId = socket.id;
      var friendId = data.friendId

      if (!id) return

      clients[id] = socketId
      broadcastToFriends('join', data)
      if (friendId) emitToOne('join', data)

    })

    socket.on('leave', function(data) {

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

    var events = ['action', 'chat', 'post']

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