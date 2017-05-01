module.exports = function(io) {

  var clients = {}

  io.on('connection', function(socket) {
    

    socket.on('join', function(data) { //add socket.id to clients and liveFriends {}

      var id = data._id,
        liveFriends = data.liveFriends

      clients[id] = {}
      clients[id].socketId = socket.id
      clients[id].liveFriends = liveFriends

      console.log('join', data, clients)

      for (var friend in liveFriends) {

        var friend = liveFriends[friend]
        clients[friend].liveFriends[id] = id

        if (io.sockets.connected[clients[friend].socketId]) io.sockets.connected[clients[friend].socketId].emit('join', data);

      }

    })


    socket.on('leave', function(data) { //remove from clients and liveFriends {}

      var id = data._id,
        liveFriends = data.liveFriends

        console.log('leave', data)

      for (var friend in liveFriends) {

        var friend = liveFriends[friend]
        if clients[friend] delete clients[friend].liveFriends[id]

        if (io.sockets.connected[clients[friend].socketId]) io.sockets.connected[clients[friend].socketId].emit('leave', data);

      }

      delete clients[id]

    })


    var events = ['action', 'message', 'post']

    events.forEach(function(event) { //add identicle socket events

      socket.on(event, function(data) {
        var id = data._id,
          liveFriends = data.liveFriends

        for (var friend in liveFriends) {

          var friend = liveFriends[friend]

             console.log('emit', event,'clients', clients, 'friend', friend, 'data', data)
          if (io.sockets.connected[clients[friend].socketId]) io.sockets.connected[clients[friend].socketId].emit('leave', data);

        }

      })

    })


    socket.on('error', function(data) {
      throw err
    })

  })

}