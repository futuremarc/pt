function animate() {

  if (key.right) myCharacter.position.x += .05
  if (key.left && myCharacter.position.x > 0) myCharacter.position.x -= .05
  else if (myCharacter.position.x < 0) sceneCharacters.visible = false
  else if (myCharacter.position.x > 0) sceneCharacters.visible = true

  for (var character in characters) {

    var character = characters[character]

    if (character.isWalking && character.data._id !== myCharacter.data._id) {
      if (character.isWalking === 'right') character.position.x += .05
      else if ( character.position.x > 0) character.position.x -= .05
    }
  }

  requestAnimationFrame(animate);
  render();

}

function render() {

  var delta = clock.getDelta();
  for (var character in characters) {
    characters[character].mixer.update(delta);
  }
  renderer.render(scene, camera);
}


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



/************* SCENE *************/

var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var clock, container, camera, scene, light, renderer, controls = {};
var myCharacter, hoveredCharacter = undefined
var projector = new THREE.Projector()

var sceneCharacters //mesh
var characters = {}; //data


function initScene(data) {

  var data = data || {}

  console.log('init data', data)

  clock = new THREE.Clock();
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  container = document.getElementById('pt-canvas');

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  container.appendChild(renderer.domElement);
  $(renderer.domElement).addClass('pt-override-page')

  camera = new THREE.OrthographicCamera(container.offsetWidth / -2, container.offsetWidth / 2, container.offsetHeight / 2, container.offsetHeight / -2, .1, 1000);
  camera.position.set(0, 1.2, 2)

  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  sceneCharacters = new THREE.Object3D();
  scene.add(sceneCharacters);

  createMyCharacter(data)
  addDomListeners()

}



/************* CHARACTER *************/


function createMyCharacter(data) {

  createCharacter(data, function(character) {

    myCharacter = character
    setCameraZoom(data)

    if (isRegistered()) {
      addLiveCharacters()
      emitJoinMsg()
    }

    animate()

  })

}

var characterDepthLevel = .00

function createCharacter(data, cB) {

  loader.load(chrome.extension.getURL('public/models/eva-animated.json'), function(geometry, materials) {

    materials.forEach(function(material) {
      material.skinning = true;
      material.depthTest = false;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));

    character.data = data
    character.mixer = new THREE.AnimationMixer(character);
    character.actions = {};
    character.mixer;
    character.animations = ['idle', 'walk', 'run', 'hello', 'pose'];
    character.activeState = 'idle';

    character.walk = function(data) {
      var direction = data.direction

      if (direction === 'right') var dir = 1
      else var dir = -1

      this.rotation.y = dir * Math.PI / 2
      this.fadeAction(this.animations[2])
      this.isWalking = direction
    }

    character.stopWalk = function() {
      this.fadeAction(this.animations[0])
      this.isWalking = false
    }

    character.wave = function() {
      this.fadeAction(this.animations[3])
    }

    character.pose = function() {
      this.fadeAction(this.animations[4])
    }

    character.fadeAction = function(name) {

      var from = this.actions[this.activeState].play();
      var to = this.actions[name].play();

      from.enabled = true;
      to.enabled = true;
      if (to.loop === THREE.LoopOnce) to.reset();
      from.crossFadeTo(to, 0.3);
      this.activeState = name;

    }

    actions = character.actions
    mixer = character.mixer

    actions.hello = mixer.clipAction(geometry.animations[0]);
    actions.idle = mixer.clipAction(geometry.animations[1]);
    actions.run = mixer.clipAction(geometry.animations[3]);
    actions.walk = mixer.clipAction(geometry.animations[4]);
    actions.pose = mixer.clipAction(geometry.animations[2]);

    for (var action in actions) {
      actions[action].setEffectiveWeight(1);
      actions[action].enabled = true;
    }

    actions.hello.setLoop(THREE.LoopOnce, 0);
    actions.hello.clampWhenFinished = true;

    actions.idle.play();

    characters[data._id] = character
    sceneCharacters.add(character)

    characterDepthLevel -= .01

    var pos = data.position || {
        x: 10,
        y: -1,
        z: characterDepthLevel
      },
      rot = data.rotation || {
        x: 0,
        y: Math.PI / 2,
        z: 0
      }

    character.position.set(pos.x, pos.y, pos.z);
    character.rotation.set(rot.x, rot.y, rot.z);

    if (cB) cB(character)

  });

}


function updateCharacter(data, request, cB) {

  var pos, rot, data = data || {}

  switch (request) {

    case 'getLocal':
      chrome.storage.sync.get('pt-user', function(data) {

        var user = data['pt-user']

        pos = user.position
        rot = user.rotation

        if (!pos && !rot) return

        console.log('GET LOCAL', user)

        myCharacter.position.set(pos.x, pos.y, pos.z)
        myCharacter.rotation.set(rot.x, rot.y, rot.z)
        myCharacter.data = user
        if (cB) cB(data)
      })

      break

    case 'putRemote':

      var name = data.name

      console.log('PUT REMOTE', data)

      $.ajax({
        method: 'PUT',
        url: 'https://passti.me/api/user/' + name,
        data: data,
        success: function(data) {
          console.log(data)
          if (cB) cB(data)
        },
        error: function(err) {
          console.log(err)
        },
      })

      break

    case 'putLocal':

      var pos = getCharacterPos()
      var rot = getCharacterRot()

      myCharacter.data.position = pos
      myCharacter.data.rotation = rot

      console.log('PUT LOCAL', myCharacter.data)

      chrome.storage.sync.set({
        'pt-user': myCharacter.data
      }, function() {
        if (cB) cB(data)
      })

      break

    case 'getRemote':
      var name = data.name || myCharacter.data.name
      var errorMessage = $('.error-message h3')

      $.ajax({
        method: 'GET',
        url: 'https://passti.me/api/user/' + name,
        success: function(data) {
          console.log('GET REMOTE', data)

          if (data.status === 'success') {
            chrome.storage.sync.set({
              'pt-user': data.data

            }, function() {
              if (isRegistered()) myCharacter.data = data.data
              if (cB) cB(data.data)
            })

          } else errorMessage.html(data.message)

        },
        error: function(err) {
          console.log(err)
        }
      })

      break
  }

}


var key = {
  left: false,
  right: false
}

var controls = {

  37: function(data, keyUp) { //left arrow

    if (keyUp) {

      data.action = 'stopWalk'
      data.event = 'action'

      if (key.left) myCharacter[data.action]()
      key.left = false;

      if (isRegistered()) {

        data.liveFriends = getLiveFriends()
        emitMsgToBg(data)
      }

    } else {

      if (!key.left) {

        data.event = 'action'
        data.action = 'walk'
        data.direction = 'left'

        myCharacter[data.action](data)

        if (data._id) {

          data.liveFriends = getLiveFriends()
          emitMsgToBg(data)
        }
      }

      key.left = true;

    }
  },
  38: function(data) { //up arrow

    data.action = 'wave'
    data.event = 'action'

    myCharacter[data.action]()

    if (isRegistered()) {
      data.liveFriends = getLiveFriends()
      emitMsgToBg(data)
    }

  },

  39: function(data, keyUp) { //right arrow

    if (keyUp) {

      data.action = 'stopWalk'
      data.event = 'action'

      if (key.right) myCharacter[data.action]()
      key.right = false;

      if (isRegistered()) {
        data.liveFriends = getLiveFriends()
        emitMsgToBg(data)
      }

    } else {

      if (!key.right) {

        data.event = 'action'
        data.action = 'walk'
        data.direction = 'right'

        myCharacter[data.action](data)

        if (isRegistered()) {

          putCharacter()
          data.liveFriends = getLiveFriends()
          emitMsgToBg(data)
        }
      }

      key.right = true;
    }

  },

  40: function(data) {

    data.action = 'pose'
    data.event = 'action'

    myCharacter[data.action]()

    if (isRegistered()) {
      data.liveFriends = getLiveFriends()
      emitMsgToBg(data)
    }

  }

}



/*************DOCUMENT LISTENERS*************/


function onKeyDown(e) {

  var keyCode = e.keyCode;

  if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) return

  var id = myCharacter.data._id
  var pos = myCharacter.data.position
  var rot = myCharacter.data.rotation

  var data = {
    _id: id,
    position: pos,
    rotation: rot
  }

  controls[keyCode](data)

}

function onKeyUp(e) {
  var keyCode = e.keyCode;

  if (keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40) return

  if (!isQuickGesture(keyCode)) putCharacter()

  var id = myCharacter.data._id
  var pos = myCharacter.data.position
  var rot = myCharacter.data.rotation

  var data = {
    _id: id,
    position: pos,
    rotation: rot
  }

  if (!isGesture(keyCode)) controls[keyCode](data, true)

}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') updateCharacter(null, 'getLocal')
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


function addDomListeners() {

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('visibilitychange', onVisibilityChange, false);
  window.addEventListener('mousemove', detectHover, false);
  window.addEventListener('resize', onWindowResize, false)

}



/*************FROM BACKGROUND*************/

function onWindowResize() {

  camera.left = container.offsetWidth / -2
  camera.right = container.offsetWidth / 2
  camera.top = container.offsetHeight / 2
  camera.bottom = container.offsetHeight / -2
  camera.near = .1
  camera.far = 1000;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  setScreenOffset()

}


function onIdleState(data) {

  var state = data.idleState
  var id = isRegistered()

  if (state === 'idle' || state === 'locked') {

    if (id) {

      var liveFriends = getLiveFriends()
      myCharacter.data.isLive = false
      putCharacter()

      var data = {
        'event': 'leave'
      }

      emitMessagetoBg(data)

    }
    hideCanvas()

  } else {

    if (id) {

      myCharacter.data.isLive = true
      putCharacter()

      var data = {
        'event': 'join'
      }
      emitMessagetoBg(data)
    }
    showCanvas()

  }

}

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

chrome.runtime.onMessage.addListener(onBgMessage);
initPt()

//wait for bg