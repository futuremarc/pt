var clients = {}


module.exports = function(io) {
  

  function broadcastToFriends(event, data, liveFriends) {

    console.log('broadcast', event, data, liveFriends)

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

    })

    socket.on('leave', function(data) { //remove from clients and liveFriends {}

      var id = data._id
      var liveFriends = data.liveFriends

      broadcastToFriends('leave', data, liveFriends)

    })

    socket.on('disconnect', function(data) { //remove from clients and liveFriends {}

      var id = data._id
      var liveFriends = data.liveFriends

      broadcastToFriends('leave', data, liveFriends)

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