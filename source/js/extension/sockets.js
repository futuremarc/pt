var socketEvents = {

  'chat': function(data) {
    console.log(data)
  },
  'post': function(data) {
    console.log(data)
  },
  'disconnect': function(data) {
    emitLeaveMsg()
  },
  'reconnect': function() {
    emitJoinMsg()
  },
  'connect': function(data) {
    console.log(data)
  },
  'join': function(data) {
    socketUpdateCharacter(data)
  },
  'leave': function(data) {
    removeCharacter(data)
  },
  'action': function(data) {
    socketUpdateCharacter(data)
  },
  'request': function(data) {
    console.log(data)
  },
  'friend': function(data) {
    refreshMainMenu()
    console.log(data)
  }
}


//


function socketUpdateCharacter(data) {

  var friend = characters[data._id]
  var pos = data.position
  var rot = data.rotation
  var action = data.action

  if (!friend) {

    characters[data._id] = true

    //update live friends

    setTimeout(function() {

      updateCharacter(null, 'getRemote', function() {

        createCharacter(data, function() {

          var friend = characters[data._id]

          friend.position.set(pos.x, pos.y, pos.z);
          friend.rotation.set(rot.x, rot.y, rot.z);

          if (action) friend[action](data)

        })
        
      }, 3000)


    })

  } else {

    friend.position.set(pos.x, pos.y, pos.z);
    friend.rotation.set(rot.x, rot.y, rot.z);

    if (action) friend[action](data)

  }
}