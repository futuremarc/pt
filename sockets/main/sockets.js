var clients = {}


module.exports = function(io) {



  io.on('connection', function(socket) {

    function broadcastToFriends(event, data) {
      console.log('broadcast', event, data, clients)

      var liveFriends = data.liveFriends

      for (var friend in liveFriends) {
        var socketId = clients[liveFriends[friend]]
        if (io.sockets.connected[socketId]) io.sockets.connected[socketId].emit(event, data, function(data) {
          console.log('sent data', data)
        });
      }

    }

    socket.on('join', function(data) { //add socket.id to clients and liveFriends {}
      var id = data._id;
      var socketId = socket.id;

      clients[id] = socketId
      broadcastToFriends('join', data)

    })

    socket.on('leave', function(data) { //remove from clients and liveFriends {}
      var id = data._id;

      delete clients[id]
      broadcastToFriends('leave', data)

    })

    socket.on('disconnect', function(data) { //remove from clients and liveFriends {}
      broadcastToFriends('leave', data)
    })


    var events = ['action', 'chat', 'post']

    events.forEach(function(event) { //add identicle socket events

      socket.on(event, function(data) {
        broadcastToFriends(event, data)

      })

    })


    socket.on('error', function(data) {
      console.log(data)
    })

  })

}