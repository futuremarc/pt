function emitMsgToBg(data) {
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

    var data = {
      event: 'join',
      _id: id,
      position: pos,
      rotation: rot,
      liveFriends: liveFriends
    }

    console.log('emitJoinMsg', data)
    emitMsgToBg(data)

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

  updateCharacter(null, 'getRemote', function(character) {

    character.friends.forEach(function(friend) {

      var friend = friend.user
      if (friend.isLive) createCharacter(friend)
    })

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

function createMenu(){

  var src = chrome.extension.getURL('menu.html');
  var iFrame = $('<iframe frameborder="0" class="pt-iframe" src=" ' + src + '"></iframe>');

  $('body').append(iFrame);

}

function setCameraZoom(data) {


  var box = new THREE.BoxGeometry(1, 2, 1)
  mesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({
    'color': 0x7ec0ee
  }))

  mesh.purpose = 'box' //associate purpose for all meshes
  mesh.position.set(0, -2, 0)
  mesh.renderOrder = 1

  //$('body').append('<div class="pt-box-info">exit</div>')
  scene.add(mesh)
  sceneCharacters.position.set(0, 1, 0);

  var box = new THREE.Box3().setFromObject(mesh);
  box.center(mesh.position);
  mesh.localToWorld(box);
  mesh.position.multiplyScalar(-1);

  camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
    container.offsetHeight / (box.max.y - box.min.y)) * .8;

  camera.updateProjectionMatrix();
  camera.updateMatrix();

  setScreenOffset()
  mesh.position.set(.5, .85, 0)

}

function setScreenOffset() {

  var newOrigin = new THREE.Vector3(0, window.innerHeight, 0)
  var screenOffset = screenToWorld(newOrigin)
  scene.position.set(screenOffset.x, 0, 0)

}


function screenToWorld(screenPos) {

  var halfConWidth = container.offsetWidth / 2
  var halfConHeight = container.offsetHeight / 2
  var worldPos = screenPos.clone();

  worldPos.x = worldPos.x / halfConWidth - 1;
  worldPos.y = -worldPos.y / halfConHeight + 1;
  projector.unprojectVector(worldPos, camera);

  return worldPos;
}

function worldToScreen(worldPos) {

  var halfConWidth = container.offsetWidth / 2
  var halfConHeight = window.innerHeight / 2
  var screenPos = worldPos.clone();

  projector.projectVector(screenPos, camera);
  screenPos.x = (screenPos.x) * halfConWidth;
  screenPos.y = (-screenPos.y) * halfConHeight;

  return screenPos;
}

function toScreenPosition(worldPos) {

  var width = renderer.domElement.width
  var height = renderer.domElement.height
  var pos = worldPos

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