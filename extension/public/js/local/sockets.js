var events = ['message', 'post']

events.forEach(function(event) { //add identicle socket events

  socket.on(event, function(data) {
    console.log(event, data)
  })

})

socket.on('join', function(data) {
  console.log('join', data)

  var id = data._id
  var friend = myCharacter.data.friends[data._id]
  friend.isAlive = true
  createCharacter(data)
  
})

socket.on('leave', function(data) {
  console.log('leave', data)

  var id = data._id
  var friend = myCharacter.data.friends[data._id]
  friend.isAlive = false
  removeCharacter()
  
})


socket.on('action', function(data) {

  var id = data._id

  if (!characters[id]) {

    createCharacter(data, function(character) {
      character[data.action](data)
      console.log('action', data)

    })
  } else {

    var character = sceneCharacters[id]
    character[data.action](data)
    console.log('action', data)

  }

})