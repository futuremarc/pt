var clock, container, camera, scene, renderer, controls, listener;

var character;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var action = {};
var mixer;
var activeState = 'idle';

var animations = ['idle', 'walk', 'run', 'hello'];


$("body").on('submit', '#pt-auth-form', function(e) {

  e.preventDefault();

  var errorMessage = $(".error-message h3")

  var email = $('.auth-email').val();
  var pass = $('.auth-password').val();
  var name = $('.auth-name').val();
  var action = $(this).data('action')

  var pos = {
    x: character.position.x,
    y: character.position.y,
    z: character.position.z
  }
  var rot = {
    x: character.rotation.x,
    y: character.rotation.y,
    z: character.rotation.z
  }

  var data = {
    email: email,
    password: pass,
    name: name,
    position: pos,
    rotation: rot
  }

  $.ajax({
    method: 'POST',
    url: 'http://localhost:8080/api/' + action,
    data: data,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
        character.data = data.data
        putCharacterLocal(data.data)
        updateCharacter(data.data)

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
  var userId = character.data._id
  var friendId = $(this).data('id')
  var action = $(this).data('action')

  var data = {
    userId: userId,
    friendId: friendId
  }

  $.ajax({
    method: 'POST',
    url: 'http://localhost:8080/api/user/friend/request/' + action,
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

$('body').on('keyup', '#pt-friend-form', function() {

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

$('body').on('click', '.friend-request-btn', function(e) {

  e.preventDefault()

  var friendId = $(this).data('id')
  var userId = character.data._id
  var action = $(this).data('action')

  var data = {
    friendId: friendId,
    userId: userId
  }

  $.ajax({
    method: 'PUT',
    url: 'http://localhost:8080/api/user/friend/request/' + action,
    data: data,
    success: function(data) {

      console.log(data)
      $('li[data-id="' + friendId + '"]').remove()

    },
    error: function(data) {
      console.log(data)
    }
  })
})

function changeSubmitButton(disable, replaceText, id) {
  if (!id) var btn = $("input[type='submit']")
  else var btn = $(id)

  if (replaceText) {
    if (!btn.val()) btn.html(replaceText)
    else btn.val(replaceText)
  }

  btn.attr('disabled', disable)
}


function putCharacterLocal(data) {

  chrome.storage.sync.set({
    'pt-user': data
  })

}

function putCharacterRemote(data) {

  if (!data.name) return

  var name = data.name

  $.ajax({
    method: 'PUT',
    url: 'http://localhost:8080/api/user/' + name,
    data: data,
    success: function(data) {
      console.log(data)
    }
  })

}


function getCharacterLocal() {

  chrome.storage.sync.get('pt-user', function(data) {
    init(data['pt-user'])
  })

}


function init(data) {

  var data = data || {}
  console.log('init data', data)

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  container = document.getElementById('pt-character');
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
  $(renderer.domElement).addClass('pt-override-page')
  camera = new THREE.OrthographicCamera(container.offsetWidth / -2, container.offsetWidth / 2, container.offsetHeight / 2, container.offsetHeight / -2, .1, 1000);
  camera.position.set(0, 1.2, 2)
  listener = new THREE.AudioListener();
  camera.add(listener);

  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  loader.load(chrome.extension.getURL('./models/eva-animated.json'), function(geometry, materials) {
    materials.forEach(function(material) {
      material.skinning = true;
    });

    character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    character.data = data
    hoveredCharacter = undefined

    mixer = new THREE.AnimationMixer(character);
    var rot = data.rotation || {
      x: 0,
      y: Math.PI / 2,
      z: 0
    }
    character.rotation.set(rot.x, rot.y, rot.z);

    action.hello = mixer.clipAction(geometry.animations[0]);
    action.idle = mixer.clipAction(geometry.animations[1]);
    action.run = mixer.clipAction(geometry.animations[3]);
    action.walk = mixer.clipAction(geometry.animations[4]);

    action.hello.setEffectiveWeight(1);
    action.idle.setEffectiveWeight(1);
    action.run.setEffectiveWeight(1);
    action.walk.setEffectiveWeight(1);

    action.hello.setLoop(THREE.LoopOnce, 0);
    action.hello.clampWhenFinished = true;

    action.hello.enabled = true;
    action.idle.enabled = true;
    action.run.enabled = true;
    action.walk.enabled = true;

    characters = new THREE.Object3D();
    characters.add(character)
    scene.add(characters);

    var pos = data.position || {
      x: 0,
      y: -1,
      z: 0
    }
    character.position.set(pos.x, pos.y, pos.z);
    characters.position.set(-pos.x, pos.y, pos.z);
    var box = new THREE.Box3().setFromObject(characters);
    box.center(characters.position);
    characters.localToWorld(box);
    characters.position.multiplyScalar(-1);

    camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
      container.offsetHeight / (box.max.y - box.min.y)) * .8;
    camera.updateProjectionMatrix();
    camera.updateMatrix();

    document.addEventListener('keydown', walk, false);
    document.addEventListener('keyup', stopWalk, false);
    window.addEventListener('focus', getAndUpdateCharacterFromLocal, false);
    //window.addEventListener('mousemove', detectHover, false);

    animate();
    action.idle.play();

  });
}

function getAndUpdateCharacterFromLocal() {
  if (!character.data._id) return

  chrome.storage.sync.get('pt-user', function(data) {

    var data = data['pt-user']
    if (!data) return

    var pos = data.position
    var rot = data.rotation
    character.position.set(pos.x, pos.y, pos.z)
    character.rotation.set(rot.x, rot.y, rot.z);
  })
}

function updateCharacter(data) {

  var pos = data.position
  var rot = data.rotation
  character.position.set(pos.x, pos.y, pos.z)
  character.rotation.set(rot.x, rot.y, rot.z);
  character.data = data

}

function fadeAction(name) {
  var from = action[activeState].play();
  var to = action[name].play();

  from.enabled = true;
  to.enabled = true;

  if (to.loop === THREE.LoopOnce) {
    to.reset();
  }

  from.crossFadeTo(to, 0.3);
  activeState = name;

}


var key = {
  left: false,
  right: false
}

function walk(e) {
  var keyCode = e.keyCode;
  if (keyCode !== 39 && keyCode !== 37 && keyCode !== 38 && keyCode !== 40) return

  //right arrow
  if (keyCode === 39) {
    if (!key.right) {
      character.rotation.y = Math.PI / 2
      fadeAction(animations[2])
    }
    key.right = true;

    //left arrow
  } else if (keyCode === 37) {
    if (!key.left) {
      character.rotation.y = -Math.PI / 2
      fadeAction(animations[2])
    }
    key.left = true;

    //up arrow
  } else if (keyCode === 38) {
    fadeAction(animations[3])

    //down arrow
  } else if (keyCode === 40) {
    fadeAction(animations[0])
  }

}

function stopWalk(e) {
  var keyCode = e.keyCode;

  if (keyCode !== 39 && keyCode !== 37) return

  if (keyCode === 39) {
    if (key.right) fadeAction(animations[0])
    key.right = false;
  } else if (keyCode === 37) {
    if (key.left) fadeAction(animations[0])
    key.left = false;
  }

  var pos = {
    x: character.position.x,
    y: character.position.y,
    z: character.position.z
  }
  var rot = {
    x: character.rotation.x,
    y: character.rotation.y,
    z: character.rotation.z
  }

  character.data.position = pos
  character.data.rotation = rot

  putCharacterLocal(character.data)
  putCharacterRemote(character.data)

}

function detectHover(e) {

  var x = (e.clientX / window.innerWidth) * 2 - 1;
  var y = -(e.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

  var intersects = raycaster.intersectObjects(characters.children, true);

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


function animate() {
  if (key.right) character.position.x += .05
  if (key.left) character.position.x -= .05
  requestAnimationFrame(animate);
  render();
}

function render() {
  var delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
}


$('<div id="pt-character" class="pt-override-page"></div>').appendTo('body');

getCharacterLocal();


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

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};