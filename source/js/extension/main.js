var isNameDisplayed = false,
  mouseX = 0,
  mouseY = 0,
  isMouseHovering = false

//


function animate() {

  animateMyChar()
  animateOtherChars()
  requestAnimationFrame(animate);
  render();
}


//


function render() {

  var delta = clock.getDelta();

  for (var character in characters) {
    characters[character].mixer.update(delta);
  }
  renderer.render(scene, camera);
}


//


function animateMyChar() {

  if (key.right && (activeKey === 39 || activeKey === 40 || activeKey === 38)) myCharacter.position.x += .05
  if (key.left && myCharacter.position.x > .7 && (activeKey === 37 || activeKey === 40 || activeKey === 38)) myCharacter.position.x -= .05

  else if (myCharacter.position.x < .7 && sceneCharacters.visible) {

    sceneCharacters.visible = false
    mesh.position.set(.25, -.1, 0)

  } else if (myCharacter.position.x > .7 && !sceneCharacters.visible) {

    sceneCharacters.visible = true
    mesh.position.set(.25, .85, 0)
  }

  if (myCharacter.isWalking && isNameDisplayed && isMouseHovering) hideNameTags()
  else if (!myCharacter.isWalking && !isNameDisplayed && isMouseHovering && sceneCharacters.visible) showNameTags()
}


//


function animateOtherChars() {

  for (var character in characters) {

    var character = characters[character]

    if (character.isWalking && character.data._id !== myCharacter.data._id) {

      if (character.isWalking === 'right') character.position.x += .05
      else if (character.position.x > 0) character.position.x -= .05

    }

    if (character.position.x < 1 && character.visible) character.visible = false
    else if (character.position.x > 1 && !character.visible) character.visible = true
      
    else if (character.isWalking && isNameDisplayed && isMouseHovering) hideNameTags()
    else if (!character.isWalking && !isNameDisplayed && isMouseHovering && sceneCharacters.visible) showNameTags()

  }
}


//


function initPt() {

  $('<div id="pt-canvas" class="pt-override-page"></div>').appendTo('body');

  chrome.storage.sync.get('pt-user', function(data) {

    var name = $('#name-tag').html()
    var signedIntoSite = name === ''
    var user = data['pt-user']

    if (user && user._id) var signedIntoExtension = user
    else var signedIntoExtension = false

    if (signedIntoExtension && signedIntoSite) updateCharacter(user, 'getRemote', function() {
      signInFromExtension(user)
    })

    initScene(user)
  })
}


/*************global listeners*************/


function detectMeshHover(e) {

  var x = (mouseX / window.innerWidth) * 2 - 1;
  var y = -(mouseY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    if (!hoveredMesh) {

      hoveredMesh = intersects[0].object;
      $('body').addClass('pt-hovering')
    }

  } else {
    if (hoveredMesh) {

      hoveredMesh = undefined;
      $('body').removeClass('pt-hovering')
    }
  }
}


//


function onCanvasHover(e) {

  if (isMouseHovering && !isNameDisplayed && sceneCharacters.visible) {
    showNameTags()
      // zoomInScene()
      // showSceneBg()
  } else if (!isMouseHovering && isNameDisplayed) {
    hideNameTags()
      // zoomOutScene()
      // hideSceneBg()
  }
}


//


function onMouseMove(e) {

  mouseX = e.clientX
  mouseY = e.clientY

  isMouseHovering = (mouseY > window.innerHeight - 85)

  detectMeshHover()
  onCanvasHover()
}


//


function onWindowResize() {

  camera.left = container.offsetWidth / -2
  camera.right = container.offsetWidth / 2
  camera.top = container.offsetHeight / 2
  camera.bottom = container.offsetHeight / -2
  camera.near = .1
  camera.far = 1000;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  setSceneOffset()
}


//


function onVisibilityChange() {
  if (document.visibilityState === 'visible') updateCharacter(null, 'getLocal')
}


//


function addDomListeners() {

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('visibilitychange', onVisibilityChange, false);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener('resize', onWindowResize, false)
}


/*************from background*************/


function onIdleState(data) {

  var state = data.data
  var id = isRegistered()

  if (state === 'idle') {

    state = 'sleep'
    myCharacter.sleep()

    if (id) {

      var info = getCharacterInfo()

      var data = {
        '_id': info._id,
        'position': info.position,
        'rotation': info.rotation,
        'liveFriends': info.liveFriends,
        'event': 'action',
        'action': state
      }

      emitMsgToBg(data)
    }


  } else if (state === 'active') {

    state = 'awake'
    myCharacter.awake()

    if (id) {

      var info = getCharacterInfo()


      var data = {
        '_id': info._id,
        'position': info.position,
        'rotation': info.rotation,
        'liveFriends': info.liveFriends,
        'event': 'action',
        'action': state
      }

      emitMsgToBg(data)
    }


  } else { //if locked

    myCharacter.sleep()

    if (id) {

      var info = getCharacterInfo()

      var data = {
        '_id': info._id,
        'position': info.position,
        'rotation': info.rotation,
        'liveFriends': info.liveFriends,
        'event': 'leave'
      }

      emitMsgToBg(data)
    }


  }
}


//


function onBgMessage(data, sender, sendResponse) {
  console.log(data)

  switch (data.type) {

    case 'idleState':
      onIdleState(data)
      break;
    case 'socket':
      onSocket(data)
      break;
  }
}


//


chrome.runtime.onMessage.addListener(onBgMessage);
initPt()


//