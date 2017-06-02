var isNameDisplayed = false,
  mouseX = 0,
  mouseY = 0,
  isMouseHovering = false,
  isMousePointer = false


//


function animate() {

  animateMyChar()
  if (isRegistered()) animateOtherChars()
  requestAnimationFrame(animate);
  render();
}


//


function render() {

  var delta = clock.getDelta();

  for (var character in characters) {
    if (characters[character].mixer) characters[character].mixer.update(delta); //sometimes render is in middle of iterating when character is removed
  }
  renderer.render(scene, camera);
}


//



function animateMyChar() {

  if (key.right && (activeKey === 39 || activeKey === 40 || activeKey === 38)) myCharacter.position.x += .065
  if (key.left && myCharacter.position.x > .2 && (activeKey === 37 || activeKey === 40 || activeKey === 38)) myCharacter.position.x -= .065

  else if (myCharacter.position.x < .2 && sceneCharacters.visible) sceneCharacters.visible = false
  else if (myCharacter.position.x > .2 && !sceneCharacters.visible) sceneCharacters.visible = true

  if (myCharacter.isWalking && isNameDisplayed && isMouseHovering) hideNameTags()
  else if (!myCharacter.isWalking && !isNameDisplayed && isMouseHovering && !isMenuDisplayed && sceneCharacters.visible) showNameTags()
}



//


function animateOtherChars() {

  for (var character in characters) {

    var character = characters[character]

    var hasData = character.data

    if (hasData && character.data._id !== myCharacter.data._id) {

      if (character.isWalking) {

        if (character.isWalking === 'right') character.position.x += .065
        else if (character.position.x > 0) character.position.x -= .065

      }

      if (character.position.x < .2 && character.visible) character.visible = false
      else if (character.position.x > .2 && !character.visible) character.visible = true

      else if (character.isWalking && isNameDisplayed && isMouseHovering) hideNameTags()
      else if (!character.isWalking && !isNameDisplayed && isMouseHovering && sceneCharacters.visible && !isMenuDisplayed) showNameTags()
    }
  }
}


//


function initPt() {

  addCanvasToPage()
    //addMenuToPage()

  if (isExtension) var method = 'getLocal'
  else var method = 'getRemote'

  updateCharacter(method, null, function(user) {

    var name = $('#pt-name-tag').html()
    var signedIntoSite = (name !== '') //if nametag empty, server responded no user

    if (user && user._id) var hasUserData = true
    else var hasUserData = false

    console.log('initPt', user)

    updateCharacter('getRemote', null, function(user) {

      if (hasUserData && !signedIntoSite && isExtension) signInFromExtension(user)
      initScene(user)
    })


  })

}


/*************global listeners*************/


function detectMeshHover(e) {

  if (!isMouseHovering && isMousePointer) {
    hidePointer()
    return
  } else if (!isMouseHovering) return

  var x = (mouseX / window.innerWidth) * 2 - 1;
  var y = -(mouseY / window.innerHeight) * 2 + 1;
  var raycaster = new THREE.Raycaster();

  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

  var intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0 && isMouseHovering) {

    if (!hoveredMesh) {

      hoveredMesh = intersects[0].object;
      if (hoveredMesh.hasPointer) showPointer()
      if (hoveredMesh.hasMenu) {
        hideNameTags()
        showMenu(hoveredMesh)
      }
    }

  } else {

    if (hoveredMesh) {
      hoveredMesh = undefined;
      hidePointer()
    }
  }
}


//


function onCanvasHover(e) {

  if (isMouseHovering && !isNameDisplayed && sceneCharacters.visible && !isMenuDisplayed) {
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
  if (document.visibilityState === 'visible') {

    if (isExtension) var method = 'getLocal'
    else var method = 'getRemote'

    if (isRegistered()) updateCharacter(method)
  }
}


//


function addDomListeners() {
  window.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  window.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onWindowResize)
}

function removeDomListeners() {
  window.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onWindowResize)
}



/*************from iframe*************/


function onWindowMsg(data) {

  if (data.origin !== 'http://localhost:8080') return;
  console.log('extension received windowMsg', data)

  var source = data.source
  var origin = data.origin
  var iframe = $('.pt-iframe')[0]
  var event = data.data.event
  var action = data.data.action
  var friendId = data.data.friendId

  if (event === 'signup' || event === 'login' || event === 'refreshPage') {
    var user = {
      name: data.data.name
    }

  } else if (event === 'update') {
    var user = data.data.user

  } else if (event === 'initAuth') {
    var user = updateCharacter('getRemote', null, function(user) {

      var data = {
        'user': user,
        'event': event,
        'type': 'window',
        'fromExtension': true
      }

      source.postMessage(data, '*')
      console.log('extension sent windowMsg', data)

    })
  } else {
    var info = getCharacterInfo()
    var user = {
      '_id': info._id,
      'position': info.position,
      'rotation': info.rotation,
      'name': info.name
    }
  }

  switch (event) {

    case 'refreshPage':

      window.reload()
      break;

    case 'initAuth':

      // above
      break;

    case 'closeIframe':

      closeIframe()
      break;

    case 'friend':

      data = {
        'user': user,
        'event': event,
        'type': 'window',
        'friendId': friendId,
        'fromExtension': true
      }

      source.postMessage(data, '*')
      console.log('extension sent windowMsg', data)

      data = {
        '_id': user._id,
        'event': event,
        'type': 'socket',
        'friendId': friendId
      }

      emitMsg(data)

      break;

    case 'request':

      data = {
        'user': user,
        'event': event,
        'type': 'window',
        'friendId': friendId,
        'fromExtension': true,
        'action': action
      }

      emitMsg(data)
      source.postMessage(data, '*')

      console.log('extension sent windowMsg', data)
      console.log('extension emit socket', data)

      if (action === 'accept') event = 'join'
      else event = 'leave'

      data = {
        '_id': user._id,
        'event': event,
        'type': 'socket',
        'position': user.position,
        'rotation': user.rotation,
        'name': user.name,
        'friendId': friendId
      }

      emitMsg(data)

      console.log('extension emit socket', data)

      var info = getFriendInfo(friendId, function(info) {

        data = {
          'position': info.position,
          'rotation': info.rotation,
          'name': info.name,
          '_id': info._id,
          'event': event,
          'friendId': friendId
        }

        socketEvents[event](data)

      })

      break;

    case 'logout':

      logout(function() {
        window.location.href = 'http://localhost:8080/logout'
      })
      break;

    case 'update':


      refreshMainMenu()

      break;

    default:

      data = {
        'user': user,
        'event': event,
        'type': 'window',
        'fromExtension': true
      }
      console.log('extension sent windowMsg', data)
      source.postMessage(data, '*')

      break;
  }

}


//


if (!isIframe) window.addEventListener("message", onWindowMsg, false);



/*************from background*************/


function onIdleState(data) {

  var state = data.data

  if (state === 'idle') {

    state = 'sleep'
    myCharacter[state]()

    if (isRegistered()) {

      var info = getCharacterInfo()
      var data = {
        '_id': info._id,
        'position': info.position,
        'rotation': info.rotation,
        'liveFriends': info.liveFriends,
        'event': 'action',
        'type': 'socket',
        'action': state
      }

      emitMsg(data)
    }


  } else if (state === 'active') {

    state = 'awake'
    myCharacter[state]()

    if (isRegistered()) emitJoinMsg()

  } else { //if locked
    state = 'sleep'

    myCharacter[state]()
    if (isRegistered()) emitLeaveMsg()
  }
}

//


function onBgMessage(data, sender, sendResponse) {
  console.log('extension recieved', data)

  switch (data.type) {

    case 'idleState':
      onIdleState(data)
      break;
    case 'socket':
      onSocket(data)
      break;
    case 'external':
      onExternalMsg(data, sender, sendResponse)
      break;
  }
}


if (isExtension) chrome.runtime.onMessage.addListener(onBgMessage);

var ptExists = $('.pt').length > 0
var isIframe = window.parent !== window.self

if (!ptExists && !isIframe) initPt()