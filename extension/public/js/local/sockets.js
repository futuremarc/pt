
var socketEvents = {

  'message': function(data) {
    console.log(data)
  },

  'post': function(data) {
    console.log(data)
  },

  'join': function(data) {

    var friend = myCharacter.data.friends[friend].user
    friend.isAlive = true
    getLiveFriends()
    createCharacter(data)
  },

  'leave': function(data) {

    var friend = myCharacter.data.friends[friend].user
    friend.isAlive = false
    getLiveFriends()
    removeCharacter()
  },

  'action': function(data) {

    var friend = sceneCharacters[data._id]
    friend[data.action](data)

  }

}