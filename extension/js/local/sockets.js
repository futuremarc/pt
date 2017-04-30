
var events = ['walk', 'stopWalk', 'action', 'message', 'post']

events.forEach(function(event) { //add identicle socket events

  socket.on(event, function(data) {
    console.log(data)
  })

})


socket.on('join', function(data){

  var friend = myCharacter.data.friends[friend]
  friend.isAlive = true

  getLiveFriends()
  createCharacter(data)

})

socket.on('leave', function(data){

  var friend = myCharacter.data.friends[friend]
  friend.isAlive = false

  getLiveFriends()
  removeCharacter()
  
})


socket.on('action', function(data){

  var friend = sceneCharacters[data._id]
  friend[data.action](data)
  
})