var events = ['message', 'post']

events.forEach(function(event) { //add identicle socket events

  socket.on(event, function(data) {
    console.log(event, data)
  })

})

socket.on('join', function(data) {

  var id = data._id
  var friend = myCharacter.data.friends[data._id]

  friend.isAlive = true
  
  var liveFriends =  getLiveFriends()
  if (!characters[id]) createCharacter(data)
  console.log('join', data)

})

socket.on('leave', function(data) {

  var id = data._id
  var friend = myCharacter.data.friends[data._id]

  friend.isAlive = false

  var liveFriends = getLiveFriends()
  if (characters[id]) removeCharacter()
  console.log('leave', data)

})


socket.on('action', function(data) {

  var id = data._id

  if (!characters[id]) {

    createCharacter(data, function(character) {

      character[data.action](data)
      console.log('action', data)
    })
  } else {

    var character = sceneCharacters[data._id]
    character[data.action](data)
    console.log('action', data)

  }

})