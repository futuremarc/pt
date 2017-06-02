var activeKey = 0,
  lastKeyUp = 0;

var key = {
  left: false,
  right: false
}

var isMobile = false;

if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

var isExtension = (chrome.storage !== undefined)
var isIframe = window.parent !== window.self


function initTouch() {

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


}

if (isMobile) initTouch()



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