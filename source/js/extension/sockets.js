
var events = ['message', 'post']

events.forEach(function(event) { //add identicle socket events

  socket.on(event, function(data) {
    console.log(event, data)
  })

})

socket.on('join', function(data){

  var friend = myCharacter.data.friends[data._id]
  
  friend.isAlive = true
  getLiveFriends()
  createCharacter(data)
  console.log('join', data)

})

socket.on('leave', function(data){

  var friend = myCharacter.data.friends[data._id]
  
  friend.isAlive = false
  getLiveFriends()
  removeCharacter()
  console.log('leave', data)
  
})


socket.on('action', function(data){

  var friend = sceneCharacters[data._id]
  friend[data.action](data)
  console.log('action', data)
  
})