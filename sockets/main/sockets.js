module.exports = function(io) {

  var clients = {}


  function broadcastToFriends(event, data, liveFriends) {

    for (var friend in liveFriends) {

      var socketId = clients[liveFriends[friend]]
      if (io.sockets.connected[socketId]) io.sockets.connected[socketId].emit(event, data);
    }

  }


  io.on('connection', function(socket) {


    socket.on('join', function(data) { //add socket.id to clients and liveFriends {}

      var id = data._id;
      var socketId = socket.id;
      var liveFriends = data.liveFriends

      clients[id] = socketId
      broadcastToFriends('join', data, liveFriends)
      console.log('join', data, clients)

    })


    socket.on('leave', function(data) { //remove from clients and liveFriends {}

      var id = data._id
      var liveFriends = data.liveFriends

      delete clients[id]
      broadcastToFriends('leave', data, liveFriends)
      console.log('leave', data, clients)

    })

    socket.on('disconnect', function(data) { //remove from clients and liveFriends {}

      var id = data._id
      var liveFriends = data.liveFriends

      delete clients[id]
      broadcastToFriends('leave', data, liveFriends)
      console.log('disconnect', data, clients)

    })


    var events = ['action', 'message', 'post']

    events.forEach(function(event) { //add identicle socket events

      socket.on(event, function(data) {

        var id = data._id
        var liveFriends = data.liveFriends
        broadcastToFriends(event, data, liveFriends)

      })

    })


    socket.on('error', function(data) {
      throw err
    })

  })

}