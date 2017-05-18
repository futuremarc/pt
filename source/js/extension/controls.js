var activeKey = 0,
  lastKeyUp = 0;

var key = {
  left: false,
  right: false
}

//


var controls = {

  37: function(data, keyUp) { //left arrow

    if (!isAltKeyDown) {

      if (keyUp) {

        data.action = 'stopWalk'
        data.event = 'action'

        if (key.left) myCharacter[data.action]()
        key.left = false;

        if (isRegistered()) emitMsgToBg(data)

      } else {

        if (!key.left) {

          data.event = 'action'
          data.action = 'walk'
          data.direction = 'left'

          myCharacter[data.action](data)

          if (isRegistered()) emitMsgToBg(data)
        }

        key.left = true;
      }
    }
  },

  38: function(data) { //up arrow

    if (!isAltKeyDown) {

      data.action = 'faceBackward'
      data.event = 'action'

    } else {

      data.action = 'wave'
      data.event = 'action'
    }

    myCharacter[data.action]()

    if (isRegistered()) emitMsgToBg(data)
  },

  39: function(data, keyUp) { //right arrow


    if (!isAltKeyDown) {

      if (keyUp) {

        data.action = 'stopWalk'
        data.event = 'action'

        if (key.right) myCharacter[data.action]()
        key.right = false;

        if (isRegistered()) emitMsgToBg(data)
      } else {

        if (!key.right) {

          data.event = 'action'
          data.action = 'walk'
          data.direction = 'right'

          myCharacter[data.action](data)

          if (isRegistered()) {

            putCharacter()
            emitMsgToBg(data)
          }
        }

        key.right = true;
      }
    }
  },

  40: function(data) { //down arrow

    if (!isAltKeyDown) {

      data.action = 'faceForward'
      data.event = 'action'

    } else {

      data.action = 'pose'
      data.event = 'action'
    }

    myCharacter[data.action]()

    if (isRegistered()) emitMsgToBg(data)
  }
}


//



isAltKeyDown = false

function onKeyDown(e) {

  if (activeKey === e.keyCode) return

  var keyCode = e.keyCode;
  activeKey = keyCode

  if (activeKey === 18) isAltKeyDown = true

  if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) return

  var data = {}

  if (isRegistered()) {

    var info = getCharacterInfo()

    data = {
      _id: info._id,
      position: info.position,
      rotation: info.rotation,
      name: info.name,
      liveFriends: info.liveFriends
    }
  }

  controls[keyCode](data)

}


//


function onKeyUp(e) {

  var keyCode = e.keyCode;
  activeKey = 0

  if (keyCode === 18) isAltKeyDown = false

  if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) return

  if (!isQuickGesture(keyCode)) putCharacter()

  var data = {}

  if (isRegistered()) {

    var info = getCharacterInfo()

    data = {
      _id: info._id,
      position: info.position,
      rotation: info.rotation,
      name: info.name,
      liveFriends: info.liveFriends
    }
  }

  if (!isGesture(keyCode)) controls[keyCode](data, true)

}


//