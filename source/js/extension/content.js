function animate() {

  if (key.right) myCharacter.position.x += .05
  if (key.left) myCharacter.position.x -= .05

  for (var character in characters) {

    var character = characters[character]

    if (character.isWalking && character.data._id !== myCharacter.data._id) {
      if (character.isWalking === 'right') character.position.x += .05
      else character.position.x -= .05
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

    var signedIntoSite = $('#name-tag').html() === ''

    if (data['pt-user'] && data['pt-user']._id) var signedIntoExtension = true
    else var signedIntoExtension = false

    if (signedIntoExtension && signedIntoSite) updateCharacter(null, 'getRemote', function(){
      signInFromExtension(data['pt-user'])
    }) 

    initScene(data['pt-user'])

  })

}



/************* SCENE *************/

var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var clock, container, camera, scene, light, renderer, controls = {};
var myCharacter, hoveredCharacter = undefined

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

  createMyCharacter(data, putCharacter)

  addDomListeners()

}



/************* CHARACTER *************/


function createMyCharacter(data) {

  createCharacter(data, function(character) {

    myCharacter = character

    var pos = data.position || {
      x: 0,
      y: -1,
      z: 0
    }

    sceneCharacters.position.set(-pos.x, pos.y, pos.z);

    var box = new THREE.Box3().setFromObject(sceneCharacters);
    box.center(sceneCharacters.position);
    sceneCharacters.localToWorld(box);
    sceneCharacters.position.multiplyScalar(-1);

    camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
      container.offsetHeight / (box.max.y - box.min.y)) * .8;

    camera.updateProjectionMatrix();
    camera.updateMatrix();

    var id = isRegistered()

    if (id) {

      myCharacter.data.isLive = true

      putCharacter(function() {

        var liveFriends = getLiveFriends()

        var pos = myCharacter.data.position
        var rot = myCharacter.data.rotation

        console.log('join')

        var data = {
          event: 'join',
          _id: id,
          position: pos,
          rotation: rot,
          liveFriends: liveFriends
        }

        emitMessage(data)

      })

    }
    animate()

  })

}

function createCharacter(data, cB) {

  loader.load(chrome.extension.getURL('./models/eva-animated.json'), function(geometry, materials) {

    materials.forEach(function(material) {
      material.skinning = true;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));

    character.data = data
    character.mixer = new THREE.AnimationMixer(character);
    character.actions = {};
    character.mixer;
    character.animations = ['idle', 'walk', 'run', 'hello', 'pose'];
    character.activeState = 'idle';

    character.walk = function(direction) {

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

      if (to.loop === THREE.LoopOnce) {
        to.reset();
      }

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
      actions.hello.enabled = true;
    }

    actions.hello.setLoop(THREE.LoopOnce, 0);
    actions.hello.clampWhenFinished = true;

    actions.idle.play();

    characters[data._id] = character
    sceneCharacters.add(character)

    var pos = data.position || {
        x: 0,
        y: -1,
        z: 0
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

  var pos, rot

  if (request === 'getLocal') {

    chrome.storage.sync.get('pt-user', function(data) {

      var data = data['pt-user']
      pos = data.position
      rot = data.rotation

      myCharacter.position.set(pos.x, pos.y, pos.z)
      myCharacter.rotation.set(rot.x, rot.y, rot.z)
      myCharacter.data = data

      if (cB) cB(data)

    })

  } else if (request === 'putRemote') {

    var name = myCharacter.data.name

    $.ajax({
      method: 'PUT',
      url: 'http://localhost:8080/api/user/' + name,
      data: data,
      success: function(data) {
        console.log(data)
        if (cB) cB(data)
      },
      error: function(err) {
        console.log(err)
      },
    })

  } else if (request === 'putLocal') {

    var pos = getCharacterPos()
    var rot = getCharacterRot()

    myCharacter.data.position = pos
    myCharacter.data.rotation = rot

    chrome.storage.sync.set({
      'pt-user': data
    }, function() {
      if (cB) cB(data)
    })

  } else if (request === 'getRemote') {

    var name = myCharacter.data.name

      $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/user/' + name,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            chrome.storage.sync.set({
              'pt-user': data
            }, function() {
              
               myCharacter.data = data
               if (cB) cB(data)
            })

          } else {
            errorMessage.html(data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })

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
        emitMessage(data)
      }

    } else {

      if (!key.left) {

        data.action = 'walk'
        data.direction = 'left'

        myCharacter[data.action](data.direction)

        if (data._id) {

          data.liveFriends = getLiveFriends()
          emitMessage(data)
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
      emitMessage(data)
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
        emitMessage(data)
      }

    } else {

      if (!key.right) {

        data.action = 'walk'
        data.direction = 'right'
        data.event = 'action'

        myCharacter[data.action](data.direction)

        if (isRegistered()) {

          putCharacter()
          data.liveFriends = getLiveFriends()
          emitMessage(data)
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
      emitMessage(data)
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
    pos: pos,
    rot: rot
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
    pos: pos,
    rot: rot
  }

  if (!isGesture(keyCode)) controls[keyCode](data, true)

}

function onVisibilityChange() {
  if (document.visibilityState === 'visible') updateCharacter(null, 'getLocal')
}



/*************FROM BACKGROUND*************/



function onIdleState(data) {

  var state = data.idleState
  var id = isRegistered()

  if (state === 'idle' || state === 'locked') {

    if (id) {

      myCharacter.data.isLive = false
      putCharacter()

      var liveFriends = getLiveFriends()
      console.log('leave')
    }

    $('#pt-canvas').hide()


  } else {

    if (id) {

      myCharacter.data.isLive = true
      updateCharacter(null, 'getLocal')

      var liveFriends = getLiveFriends()
      console.log('join')
    }

    $('#pt-canvas').show()

  }

}
function onMessage(data, sender, sendResponse) {
  console.log(data, sender)

  switch (data) {

    case idleState:
      onIdleState(data)
      break;
    case isSocket:
      onSocket(data)
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
  }

}

chrome.runtime.onMessage.addListener(onMessage);
initPt()

//wait for bg