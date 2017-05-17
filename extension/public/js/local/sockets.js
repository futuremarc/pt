var socketEvents = {

  'chat': function(data) {
    console.log(data)
  },
  'post': function(data) {
    console.log(data)
  },
  'disconnect': function(data) {
    var data = {
      'event': 'leave'
    }
    emitMsgToBg(data)
  },
  'reconnect': function() {
    emitJoinMsg()
  },
  'connect': function() {
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

      friend.position.set(pos.x, pos.y, pos.z);
      friend.rotation.set(rot.x, rot.y, rot.z);

      var friend = characters[data._id]

      if (data.action) friend[data.action](data)
    })

  } else {

    if (data.action) friend[data.action](data)

    friend.position.set(pos.x, pos.y, pos.z);
    friend.rotation.set(rot.x, rot.y, rot.z);

  }
}

