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
  }
}


//


function socketUpdateCharacter(data) {

  var friend = characters[data._id]
  var pos = data.position
  var rot = data.rotation

  if (!friend) {

    characters[data._id] = {} //dont let PT create same character before character is finished creating

    createCharacter(data, function() {

      var friend = characters[data._id]

      friend.position.set(pos.x, pos.y, pos.z);
      friend.rotation.set(rot.x, rot.y, rot.z);

      if (data.action) friend[data.action](data)
    })

  } else {

    friend.position.set(pos.x, pos.y, pos.z);
    friend.rotation.set(rot.x, rot.y, rot.z);

    if (data.action) friend[data.action](data)

  }
}