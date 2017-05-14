function emitMessageToBg(data) {
  chrome.runtime.sendMessage(data);
}

function onSocket(data) {
  var event = data.event
  socketEvents[event](data)
}

function emitJoinMsg() {

  myCharacter.data.isLive = true

  putCharacter(function() {

    var liveFriends = getLiveFriends()
    var pos = myCharacter.data.position
    var rot = myCharacter.data.rotation
    var id = myCharacter.data._id

    console.log('emitJoinMsg')

    var data = {
      event: 'join',
      _id: id,
      position: pos,
      rotation: rot,
      liveFriends: liveFriends
    }
    emitMessageToBg(data)

  })

}


function isQuickGesture(keyCode) { //wave
  return (keyCode === 38)
}


function isGesture(keyCode) { //wave, pose
  return keyCode === 38 || keyCode === 40
}



function isRegistered() {
  if (!myCharacter) return false
  if (!myCharacter.data) return false
  return myCharacter.data._id
}

function putCharacter(cB) {

  updateCharacter(myCharacter.data, 'putLocal')
  if (isRegistered()) updateCharacter(myCharacter.data, 'putRemote', cB)
}


function getCharacterPos() {

  var pos = {
    x: myCharacter.position.x,
    y: myCharacter.position.y,
    z: myCharacter.position.z
  }

  return pos

}

function addLiveCharacters() {

  myCharacter.data.friends.forEach(function(friend) {

    var friend = friend.user
    if (friend.isLive) createCharacter(friend)
  })
}


function getCharacterRot() {

  var rot = {
    x: myCharacter.rotation.x,
    y: myCharacter.rotation.y,
    z: myCharacter.rotation.z
  }

  return rot

}

function removeCharacter(data) {

  scene.remove(sceneCharacters[data._id])
  delete sceneCharacters[data._id]
  delete characters[data._id]

}

function getLiveFriends() {

  var liveFriends = {}

  myCharacter.data.friends.forEach(function(friend) {

    var friend = friend.user
    if (friend.isLive) liveFriends[friend._id] = friend._id
  })

  return liveFriends

}

function setCameraZoom(data) {

  var pos = {
    x: 0,
    y: 0,
    z: 0
  }

  sceneCharacters.position.set(pos.x, pos.y, pos.z);

  var box = new THREE.Box3().setFromObject(scene);
  box.center(pos);
  sceneCharacters.localToWorld(box);
  sceneCharacters.position.multiplyScalar(-1);

  camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
    container.offsetHeight / (box.max.y - box.min.y)) * .8;

  camera.updateProjectionMatrix();
  camera.updateMatrix();

}

function toScreenPosition(obj, camera) {

  var width = renderer.domElement.width
  var height = renderer.domElement.height
  var pos = obj.position

  var p = new THREE.Vector3(pos.x, pos.y, pos.z);
  var vector = p.project(camera);

  vector.x = ((vector.x + 1) / 2 * width) / 2;
  vector.y = -(vector.y - 1) / 2 * height;

  return vector;

};


function changeSubmitButton(disable, replaceText, id) {
  if (!id) var btn = $("input[type='submit']")
  else var btn = $(id)

  if (replaceText) {
    if (!btn.val()) btn.html(replaceText)
    else btn.val(replaceText)
  }

  btn.attr('disabled', disable)
}

function hideCanvas() {
  $('#pt-canvas').hide()
}

function showCanvas() {
  $('#pt-canvas').show()
}