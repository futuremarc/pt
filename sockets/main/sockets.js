module.exports = function(io) {

  var clients = {}

  io.on('connection', function(socket) {

    socket.on('error', function(data) {
      throw err
    })

    //add socket.id to clients and friends {}
    socket.on('join', function(data) {

      var id = data._id, friends = data.friends, mappedFriends = {}

      friends.forEach(function(friend) {
        mappedFriends[friend] = socket.id
      })

      clients[id].socketId = socket.id
      clients[id].friends = mappedFriends

      friends.forEach(function(friend) {

        var friend = clients[friend]
        friend.friends[id] = id

        if (io.sockets.connected[friend.socketId]) io.sockets.connected[friend.socketId].emit('join', data);

      })
    })

    //remove from clients and friends {}
    socket.on('leave', function(data) {

      var id = data._id, friends = data.friends

      friends.forEach(function(friend) {

        var friend = clients[friend]
        delete friend.friends[id]

        if (io.sockets.connected[friend.socketId]) io.sockets.connected[friend.socketId].emit('leave', data);

      })

      delete clients[id]

    })

    //add identicle socket events
    var events = ['updatePos', 'updateAction', 'message', 'post']

    events.forEach(function(event) {

      socket.on(event, function(data) {

        var id = data._id, friends = data.friends

        friends.forEach(function(friend) {

          var friend = clients[friend]

          if (io.sockets.connected[friend.socketId]) io.sockets.connected[friend.socketId].emit(event, data);
        })

      })



    })

  })

}