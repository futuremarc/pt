var activeKey = 0,
  lastKeyUp = 0;

var key = {
  left: false,
  right: false
}


  var lastPan = {
    keyCode: 38
  }

  var hammer = new Hammer(document.body);
  hammer.get('pan').set({
    'direction': Hammer.DIRECTION_ALL,
    'threshold': 10
  });


  var direction = Hammer.DIRECTION_DOWN

  function triggerKeyUp() {

    lastPan = {
      keyCode: activeKey
    }
    onKeyUp(lastPan)
    direction = 0 //reset direction for onPan

  }

  function onPan(e) {

    if (e.velocityX < .2 && e.velocityX > -.2 && e.velocityY < .2 && e.velocityY > -.2) return

    if (direction !== e.direction) {

      if (e.direction === Hammer.DIRECTION_LEFT) var keyCode = 37
      else if (e.direction === Hammer.DIRECTION_RIGHT) var keyCode = 39
      else if (e.direction === Hammer.DIRECTION_UP) var keyCode = 38
      else if (e.direction === Hammer.DIRECTION_DOWN) var keyCode = 40

      triggerKeyUp()

      lastPan = {
        keyCode: keyCode
      }
      onKeyDown(lastPan)
      direction = e.direction
    }


  }

  function onPanEnd(e) {
    triggerKeyUp()
  }


  hammer.on('panend', onPanEnd);
  hammer.on('pan press', onPan);


var controls = {

  37: function(data, keyUp) { //left arrow

    if (!isAltKeyDown) {

      if (keyUp) {

        data.action = 'stopWalk'
        data.event = 'action'

        if (key.left) myCharacter[data.action]()
        key.left = false;

        if (isRegistered()) emitMsg(data)

      } else {

        if (!key.left) {

          data.event = 'action'
          data.action = 'walk'
          data.direction = 'left'

          myCharacter[data.action](data)

          if (isRegistered()) emitMsg(data)
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

    if (isRegistered()) emitMsg(data)
  },

  39: function(data, keyUp) { //right arrow


    if (!isAltKeyDown) {

      if (keyUp) {

        data.action = 'stopWalk'
        data.event = 'action'

        if (key.right) myCharacter[data.action]()
        key.right = false;

        if (isRegistered()) emitMsg(data)
      } else {

        if (!key.right) {

          data.event = 'action'
          data.action = 'walk'
          data.direction = 'right'

          console.log(myCharacter, data)
          myCharacter[data.action](data)

          if (isRegistered()) {

            putCharacter()
            emitMsg(data)
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

    if (isRegistered()) emitMsg(data)
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
      'type': 'socket',
      '_id': info._id,
      'position': info.position,
      'rotation': info.rotation,
      'name': info.name,
      'liveFriends': info.liveFriends
    }
  }

  controls[keyCode](data)

}


//

var putCharacterTimeout = null

function onKeyUp(e) {

  var keyCode = e.keyCode;
  activeKey = 0

  if (keyCode === 18) isAltKeyDown = false

  if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) return

  if (!isQuickGesture(keyCode)){
    
    clearTimeout(putCharacterTimeout)
    putCharacterTimeout = setTimeout(putCharacter, 1000)

  }

  var data = {}

  if (isRegistered()) {

    var info = getCharacterInfo()

    data = {
      'type': 'socket',
      '_id': info._id,
      'position': info.position,
      'rotation': info.rotation,
      'name': info.name,
      'liveFriends': info.liveFriends
    }
  }

  if (!isGesture(keyCode)) controls[keyCode](data, true)

}


//