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

var left_wall_x = .5
var walk_speed = .045
var run_speed = .075


var isCameraAligned = true
var isAwayFromHome = false

function animateMyChar() {

  // if (key.right) myCharacter.position.x += walk_speed
  // if (key.left) myCharacter.position.x -= walk_speed

  if (key.right && (activeKey === 39 || activeKey === 40 || activeKey === 38)) myCharacter.position.x += walk_speed
  if (key.left && myCharacter.position.x > left_wall_x && (activeKey === 37 || activeKey === 40 || activeKey === 38)) myCharacter.position.x -= walk_speed


  else if (myCharacter.position.x < left_wall_x && scene.visible) scene.visible = false
  else if (myCharacter.position.x > left_wall_x && !scene.visible) scene.visible = true

  if (myCharacter.isWalking && isNameDisplayed && isMouseHovering) hideNameTags()
  else if (!myCharacter.isWalking && !isNameDisplayed && isMouseHovering && !isMenuDisplayed && scene.visible) showNameTags()

  if (myCharacter.position.x > windowCenter.x && !isAwayFromHome) {
    isAwayFromHome = true
    $('.pt-return-home').show()
  } else if (myCharacter.position.x < windowCenter.x && isAwayFromHome) {
    isAwayFromHome = false
    $('.pt-return-home').hide()
  }

  if (isAwayFromHome && isMobile && camera.position.x !== myCharacter.position.x - windowCenter.x) { //follow character, align if not aligned

    camera.position.x = myCharacter.position.x - windowCenter.x
      //console.log(myCharacter.position.x, windowCenter.x, camera.position.x, myCharacter.position.x > windowCenter.x)
  }

}



//


function animateOtherChars() {

  for (var character in characters) {

    var character = characters[character]

    var hasData = character.data

    if (hasData && character.data._id !== myCharacter.data._id) {

      if (character.isWalking) {

        if (character.isWalking === 'right') character.position.x += walk_speed
        else if (character.position.x > left_wall_x) character.position.x -= walk_speed

      }

      if (character.position.x < left_wall_x && character.visible) character.visible = false
      else if (character.position.x > left_wall_x && !character.visible) character.visible = true

      else if (character.isWalking && isNameDisplayed && isMouseHovering) hideNameTags()
      else if (!character.isWalking && !isNameDisplayed && isMouseHovering && scene.visible && !isMenuDisplayed) showNameTags()
    }
  }
}


//


function initPt() {

  addCanvasToPage()

  if (isExtension) var method = 'getLocal'
  else var method = 'getRemote'

  console.log('initPt', method)

  updateCharacter(method, null, function(user) {

    console.log('initPt', user)

    var name = $('#pt-name-tag').html()
    var signedIntoSite = (name !== '') //if nametag empty, server responded no user

    if (user && user._id) var hasUserData = true
    else var hasUserData = false

    if (hasUserData && !signedIntoSite && isExtension) signInFromExtension(user)
    if (user) initScene(user)
    else if (method === 'getLocal') updateCharacter('getRemote', null, function(user) {
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

  if (isMouseHovering && !isNameDisplayed && scene.visible && !isMenuDisplayed) {
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

  isMouseHovering = (mouseY > window.innerHeight - canvas_height)

  detectMeshHover()
  onCanvasHover()
}


//

function onWindowResize() {

  isCameraAligned = false

  camera.left = container.offsetWidth / -2
  camera.right = container.offsetWidth / 2
  camera.top = container.offsetHeight / 2
  camera.bottom = container.offsetHeight / -2
  camera.near = .1
  camera.far = 1000;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  setSceneOffset()

  computeWindowCenter()

  showNameTags() //reset name tags
  hideNameTags()

  isCameraAligned = true
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


delete Hammer.defaults.cssProps.userSelect; //allow user select on desktop

var hammer = new Hammer.Manager(document.body);

hammer.add(new Hammer.Pan({
  direction: Hammer.DIRECTION_ALL,
  threshold: 10
}));
hammer.add(new Hammer.Press());
hammer.add(new Hammer.Tap({
  event: 'doubletap',
  taps: 2
}));

function addDomListeners() {
  $(document).on('click touchstart', onDocumentClick)
  $(document).on('keydown', onKeyDown)
  $(document).on('keyup', onKeyUp)
  $(window).on('visibilitychange', onVisibilityChange)
  $(window).on('mousemove', onMouseMove)
  $(window).on('resize', onWindowResize)
  $(window).on('orientationchange', onWindowResize)
  hammer.on('panend', onPanEnd);
  hammer.on('pan press', onPan);
  hammer.on('doubletap', onDoubleTap);
  window.addEventListener("message", onWindowMsg, false);
}

function removeDomListeners() {
  $(document).off('click touchstart', onDocumentClick)
  $(document).off('keydown', onKeyDown)
  $(document).off('keyup', onKeyUp)
  $(window).off('visibilitychange', onVisibilityChange)
  $(window).off('mousemove', onMouseMove)
  $(window).off('resize', onWindowResize)
  $(window).off('orientationchange', onWindowResize)
  hammer.off('panend', onPanEnd);
  hammer.off('pan press', onPan);
  hammer.off('doubletap', onDoubleTap);
  window.removeEventListener("message", onWindowMsg, false);
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

var ptExists = ($('.pt').length > 0)
var isIframe = window.parent !== window.self

if (isExtension && !ptExists) chrome.runtime.onMessage.addListener(onBgMessage);

var id = 'malhbgmooogkoheilhpjnlimhmnmlpii'

detectExtensionInstalled(id, function(hasPt) {

  window.hasExtension = hasPt
  setInstallBtn()

  var doRun = (!hasExtension && !isExtension && !isIframe && !ptExists) || (!isIframe && !ptExists && hasExtension && isExtension)
  if (doRun) initPt()

})


// if (!ptExists && !isIframe && !hasExtension) initPt()