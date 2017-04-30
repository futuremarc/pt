var events = ['walk', 'stopWalk', 'updateAction', 'message', 'post', 'join', 'leave']

events.forEach(function(event) { //add identicle socket events

  socket.on(event, function(data) {

    console.log(data)

  })

})