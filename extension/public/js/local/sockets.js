var socketEvents = {

  'chat': function(data) {
    console.log(data)
  },

  'post': function(data) {
    console.log(data)
  },

  'disconnect': function(data) {
    console.log('disconnect', data)
    emitJoinMsg()
  },

  'join': function(data) {
    console.log('socket join', data)
    createCharacter(data)
  },
  'leave': function(data) {
    removeCharacter()
  },
  'action': function(data) {

    console.log(data)

    var friend = characters[data._id]
    var pos = data.position
    var rot = data.rotation

    if (!friend) {

      createCharacter(data, function() {

        var friend = characters[data._id]
        friend[data.action](data)

        friend.position.set(pos.x, pos.y, pos.z);
        friend.rotation.set(rot.x, rot.y, rot.z);
      })

    }else{

        friend[data.action](data)
        friend.position.set(pos.x, pos.y, pos.z);
        friend.rotation.set(rot.x, rot.y, rot.z);
    }
    

  }

}