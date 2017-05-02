function putCharacter(cB) {

  updateCharacter(myCharacter.data, 'putLocal')
  if (isRegistered()) updateCharacter(myCharacter.data, 'putRemote', cB)
}

function emitMessage(data) {
  chrome.runtime.sendMessage(data);
}

function onSocket(data) {
  var event = data.event
  socketEvents[event](data)
}


function isQuickGesture(keyCode) {
  return (keyCode === 38) //wave
}


function isGesture(keyCode) {
  //wave, pose
  return keyCode === 38 || keyCode === 40
}



function isRegistered() {
  return myCharacter.data._id
}

function getCharacterPos() {

  var pos = {
    x: myCharacter.position.x,
    y: myCharacter.position.y,
    z: myCharacter.position.z
  }

  return pos

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

function addDomListeners() {

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('visibilitychange', onVisibilityChange, false);
  window.addEventListener('mousemove', detectHover, false);

}


function detectHover(e) {

  var x = (e.clientX / window.innerWidth) * 2 - 1;
  var y = -(e.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (!hoveredCharacter) {
      hoveredCharacter = intersects[0].object;
      $('body').addClass('pt-hovering')
    }

  } else {
    if (hoveredCharacter) {
      hoveredCharacter = undefined;
      $('body').removeClass('pt-hovering')
    }

  }

}


function signInFromExtension(data) {

  var errorMessage = $(".error-message h3")

  var my = data

  var data = {
    email: my.email,
    password: my.password,
    name: my.name
  }

  $.ajax({
    method: 'POST',
    url: 'https://passti.me/api/login',
    data: data,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')

        setTimeout(function() {
          location.href = '/'
        }, 500)

      } else {
        errorMessage.html(data.message)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })

}