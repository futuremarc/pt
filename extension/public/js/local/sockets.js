
var socketEvents = {

  'message': function(data) {
    console.log(data)
  },

  'post': function(data) {
    console.log(data)
  },

  'join': function(data) {
    createCharacter(data)
  },

  'leave': function(data) {
    removeCharacter()
  },

  'action': function(data) {

    var friend = sceneCharacters[data._id]
    friend[data.action](data)

  }

}