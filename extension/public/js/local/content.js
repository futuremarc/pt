var socket = io('https://passti.me', {
  path: '/socket',
  secure: true
})

function animate() {

  if (key.right) myCharacter.position.x += .05
  if (key.left) myCharacter.position.x -= .05

  for (var character in characters){

    var character = characters[character]

    if (character.isWalking && character._id !== myCharacter._id){
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
    initScene(data['pt-user'])
  })

}


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

  createMyCharacter(data, function() {
    updateCharacter(myCharacter.data, 'putLocal')
    if (myCharacter.data._id) updateCharacter(myCharacter.data, 'putRemote')
  })

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('visibilitychange', onVisibilityChange, false);
  window.addEventListener('mousemove', detectHover, false);

}

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

    //if user registered
    if (myCharacter._id) {

      getLiveFriends()

      if (!myCharacter.isLive) {

        var id = myCharacter.data._id
        var liveFriends = myCharacter.data.liveFriends
        var pos = myCharacter.data.position
        var rot = myCharacter.data.rotation

        socket.emit('join', {
          _id: id,
          position: pos,
          rotation: rot,
          friends: liveFriends
        })

        myCharacter.isLive = true;

      }


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

  if (request) {
    if (request === 'getLocal') {

      chrome.storage.sync.get('pt-user', function(data) {

        var data = data['pt-user']
        pos = data.position
        rot = data.rotation

        myCharacter.position.set(pos.x, pos.y, pos.z)
        myCharacter.rotation.set(rot.x, rot.y, rot.z)
        myCharacter.data = data

        console.log('getLocal', data)

        if (cB) cB()

      })

    } else if (request === 'putRemote') {

      var name = data.name

      $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/api/user/' + name,
        data: data,
        success: function(data) {
          console.log(data)
          if (cB) cB()
        },
        error: function(err) {
          console.log(err)
        },
      })

    } else if (request === 'putLocal') {

      var pos = {
          x: myCharacter.position.x,
          y: myCharacter.position.y,
          z: myCharacter.position.z
        },
        rot = {
          x: myCharacter.rotation.x,
          y: myCharacter.rotation.y,
          z: myCharacter.rotation.z
        }

      myCharacter.data.position = pos
      myCharacter.data.rotation = rot

      chrome.storage.sync.set({
        'pt-user': data
      }, function() {
        if (cB) cB()
      })

    }


  } else {

    pos = data.position
    rot = data.rotation

    myCharacter.position.set(pos.x, pos.y, pos.z)
    myCharacter.rotation.set(rot.x, rot.y, rot.z);
    myCharacter.data = data

    if (cB) cB()

  }

}

function removeCharacter(data) {
  scene.remove(sceneCharacters[data._id])
  delete sceneCharacters[data._id]
  delete characters[data._id]
}

var liveFriends = {}

function getLiveFriends() {

  for (var friend in myCharacter.data.friends) {

    var friend = myCharacter.data.friends[friend]
    if (friend.isAlive) liveFriends[friend._id] = [friend._id]

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

      if (key.left) myCharacter[data.action]()
      key.left = false;

      if (data._id) socket.emit('action', data)

    } else {

      if (!key.left) {

        data.action = 'walk'
        data.direction = 'left'

        myCharacter[data.action](data.direction)
        if (data._id) socket.emit('action', data)
      }

      key.left = true;

    }
  },
  38: function(data) { //up arrow

    data.action = 'wave'
    myCharacter[data.action]()

    if (data._id) socket.emit('action', data)

  },

  39: function(data, keyUp) { //right arrow

    if (keyUp) {
      data.action = 'stopWalk'

      if (key.right) myCharacter[data.action]()
      key.right = false;
      if (data._id) socket.emit('action', data)

    } else {

      if (!key.right) {

        data.action = 'walk'
        data.direction = 'right'

        myCharacter[data.action](data.direction)
        if (data._id) socket.emit('action', data)
      }

      key.right = true;

    }

  },

  40: function(data) {

    data.action = 'pose'
    myCharacter[data.action]()
    if (data._id) socket.emit('action', data)
  }

}

function onKeyDown(e) {

  var keyCode = e.keyCode;

  if (keyCode !== 39 && keyCode !== 37 && keyCode !== 38 && keyCode !== 40) return

  var id = myCharacter.data._id
  var liveFriends = myCharacter.data.liveFriends

  myCharacter.data.position
  var pos = myCharacter.data.position
  var rot = myCharacter.data.rotation

  var data = {
    _id: id,
    liveFriends: liveFriends,
    pos: pos,
    rot: rot
  }

  controls[keyCode](data)

}

function onKeyUp(e) {
  var keyCode = e.keyCode;

  if (keyCode !== 39 && keyCode !== 37) return

  updateCharacter(myCharacter.data, 'putLocal')
  if (myCharacter.data._id) updateCharacter(myCharacter.data, 'putRemote')

  var id = myCharacter.data._id
  var liveFriends = myCharacter.data.liveFriends
  var pos = myCharacter.data.position
  var rot = myCharacter.data.rotation

  var data = {
    _id: id,
    liveFriends: liveFriends,
    pos: pos,
    rot: rot
  }

  controls[keyCode](data, true)

}

function onVisibilityChange() {

  if (document.visibilityState === 'visible') updateCharacter(null, 'getLocal')

}



initPt();


/********* FORMS ***********/

$("body").on('submit', '#pt-auth-form', function(e) {

  e.preventDefault();

  var errorMessage = $(".error-message h3")

  var email = $('.auth-email').val();
  var pass = $('.auth-password').val();
  var name = $('.auth-name').val();
  var action = $(this).data('action')
  var subs = []

  $("#pt-auth-form input:checkbox:checked").each(function() {

    var sub = $(this).data('id')
    subs.push(sub)
  });


  var pos = {
      x: myCharacter.position.x,
      y: myCharacter.position.y,
      z: myCharacter.position.z
    },
    rot = {
      x: myCharacter.rotation.x,
      y: myCharacter.rotation.y,
      z: myCharacter.rotation.z
    }

  var data = {
    email: email,
    password: pass,
    name: name,
    position: pos,
    rotation: rot,
    subscriptions: subs
  }

  $.ajax({
    method: 'POST',
    url: 'http://localhost:8080/api/' + action,
    data: data,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')

        myCharacter.data = data.data
        updateCharacter(myCharacter.data, 'putLocal')

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
})


$("body").on('submit', '#pt-friend-form', function(e) {

  e.preventDefault();

  var errorMessage = $(".error-message h3")

  var name = $('.auth-name').val();
  var userId = myCharacter.data._id
  var friendId = $(this).data('id')
  var action = $(this).data('action')

  var data = {
    userId: userId,
    friendId: friendId
  }

  $.ajax({
    method: 'POST',
    url: 'http://localhost:8080/api/user/friend/' + action,
    data: data,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        errorMessage.html(data.message + ' to <strong>' + data.data.name + '</strong>!')

      } else {
        errorMessage.html(data.message)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })
})


var timeout = null;

$('body').on('keyup', '#pt-friend-form', function(e) {

  if (e.keyCode === 13) return

  var errorMessage = $(".error-message h3")
  var name = $(this).find('input').val()

  clearTimeout(timeout)
  errorMessage.html('searching...')

  var self = this

  $.ajax({
    method: 'GET',
    url: 'http://localhost:8080/api/user/' + name,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        if (data.data) errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
        $(self).data('id', data.data._id)
        changeSubmitButton(false)

      } else if (data.status === 'not found') {
        changeSubmitButton(true)
        timeout = setTimeout(function() {
          errorMessage.html('&nbsp;')
        }, 2000)
      } else if (data.status === 'error') {
        errorMessage.html(data.message)
        changeSubmitButton(true)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })

})

$('body').on('click', '#logout', function() {
  chrome.storage.sync.set({
    'pt-user': {}
  }, function() {
    window.location.href = 'http://localhost:8080/logout'
  })
})

$('body').on('click', '.friend-request-btn, .friends-list-btn', function(e) {

  e.preventDefault()

  var friendId = $(this).data('id')
  var userId = myCharacter.data._id
  var purpose = $(this).data('purpose')
  var action = $(this).data('action')
  if (action === 'accept' || action === 'reject') var method = 'PUT'
  else if (action === 'remove') var method = 'DELETE'

  var data = {
    friendId: friendId,
    userId: userId
  }

  var self = this

  $.ajax({
    method: method,
    url: 'http://localhost:8080/api/user/friend/' + action,
    data: data,
    success: function(data) {
      console.log(data)

      if (data.status === 'success') $(self).parentsUntil(1).closest('li').remove()

    },
    error: function(data) {
      console.log(data)
    }
  })
})

/********* HELPERS *********/


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