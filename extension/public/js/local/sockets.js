var socketEvents = {

  'chat': function(data) {

  },
  'post': function(data) {

  },
  'disconnect': function(data) {
    emitLeaveMsg()
  },
  'reconnect': function() {
    emitJoinMsg()
  },
  'connect': function(data) {

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
  },
  'friend': function(data) {
    refreshMainMenu()
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

      updateCharacter('getRemote', null, function() {

        createCharacter(data, function() {

          var friend = characters[data._id]

          friend.position.set(pos.x, pos.y, pos.z);
          friend.rotation.set(rot.x, rot.y, rot.z);

          if (action) friend[action](data)

        })
        
      }, 3000)


    })

  } else {

    if (!friend.position) return //if character isnt finished creating return
    friend.position.set(pos.x, pos.y, pos.z);
    friend.rotation.set(rot.x, rot.y, rot.z);

    if (action) friend[action](data)

  }
}