function getAndUpdateCharacterFromLocal() {
  if (!myCharacter.data._id) return

  chrome.storage.sync.get('pt-user', function(data) {

    var data = data['pt-user']
    if (!data) return

    var pos = data.position
    var rot = data.rotation
    myCharacter.position.set(pos.x, pos.y, pos.z)
    myCharacter.rotation.set(rot.x, rot.y, rot.z);
  })
}

function updateCharacter(data) {

  var pos = data.position
  var rot = data.rotation
  myCharacter.position.set(pos.x, pos.y, pos.z)
  myCharacter.rotation.set(rot.x, rot.y, rot.z);
  myCharacter.data = data

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

var clock, container, camera, scene, renderer, controls, listener;

var myCharacter
var characters = {};
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var hoveredCharacter = undefined


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

  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  window.addEventListener('focus', getAndUpdateCharacterFromLocal, false);
  //window.addEventListener('mousemove', detectHover, false);


  createCharacter(data, function(character) {

    myCharacter = character

    //adjust camera after creating first character
    var box = new THREE.Box3().setFromObject(myCharacter);
    box.center(myCharacter.position);
    myCharacter.localToWorld(box);
    myCharacter.position.multiplyScalar(-1);

    camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
      container.offsetHeight / (box.max.y - box.min.y)) * .8;
    camera.updateProjectionMatrix();
    camera.updateMatrix();

    animate()

  })



}

var key = {
  left: false,
  right: false
}

function onKeyDown(e) {

  var keyCode = e.keyCode;
  if (keyCode !== 39 && keyCode !== 37 && keyCode !== 38 && keyCode !== 40) return

  if (keyCode === 39) {

    if (!key.right) myCharacter.walk('right')
    key.right = true;

  } else if (keyCode === 37) {

    if (!key.left) myCharacter.walk('left')
    key.left = true;

  } else if (keyCode === 38) myCharacter.wave() //up arrow
  else if (keyCode === 40) myCharacter.pose() //down arrow

}

function onKeyUp(e) {
  var keyCode = e.keyCode;

  if (keyCode !== 39 && keyCode !== 37) return

  if (keyCode === 39) {
    if (key.right) myCharacter.stopWalk() //stop walk right
    key.right = false;
  } else if (keyCode === 37) {
    if (key.left) myCharacter.stopWalk() //stop walk left
    key.left = false;
  }

  var pos = {
    x: myCharacter.position.x,
    y: myCharacter.position.y,
    z: myCharacter.position.z
  }
  var rot = {
    x: myCharacter.rotation.x,
    y: myCharacter.rotation.y,
    z: myCharacter.rotation.z
  }

  myCharacter.data.position = pos
  myCharacter.data.rotation = rot

  putCharacterLocal(myCharacter.data)
  putCharacterRemote(myCharacter.data)

}

function createCharacter(data, cB) {

  loader.load(chrome.extension.getURL('./models/eva-animated.json'), function(geometry, materials) {
    materials.forEach(function(material) {
      material.skinning = true;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));

    var rot = data.rotation || {
      x: 0,
      y: Math.PI / 2,
      z: 0
    }
    character.rotation.set(rot.x, rot.y, rot.z);

    var pos = data.position || {
      x: 0,
      y: 0,
      z: 0
    }
    character.position.set(pos.x, pos.y, pos.z);

    character.data = data
    character.mixer = new THREE.AnimationMixer(character);
    character.actions = {};
    character.mixer;
    character.animations = ['idle', 'walk', 'run', 'hello', 'pose'];
    character.activeState = 'idle';

    character.walk = function(direction) {
      if (direction === 'right') var dir = 1
      else dir = -1

      this.rotation.y = dir * Math.PI / 2
      this.fadeAction(this.animations[2])
    }

    character.stopWalk = function(){
      this.fadeAction(this.animations[0])
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


    characters[character.data._id] = character

    scene.add(character);

    if (cB) cB(character)

  });

}


function animate() {
  if (key.right) myCharacter.position.x += .05
  if (key.left) myCharacter.position.x -= .05
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


$('<div id="pt-character" class="pt-override-page"></div>').appendTo('body');

getCharacterLocal();



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
    console.log(sub)
  });
  console.log('subs', subs)


  var pos = {
    x: myCharacter.position.x,
    y: myCharacter.position.y,
    z: myCharacter.position.z
  }
  var rot = {
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
        putCharacterLocal(data.data)
        updateCharacter(data.data)
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

$('body').on('click', '.friend-request-btn, .friends-list-btn', function(e) {

  e.preventDefault()

  var friendId = $(this).data('id')
  var userId = myCharacter.data._id
  var action = $(this).data('action')
  if (action === 'accept' || action === 'reject') var method = 'PUT'
  else if (action === 'remove') var method = 'DELETE'

  var data = {
    friendId: friendId,
    userId: userId
  }

  $.ajax({
    method: method,
    url: 'http://localhost:8080/api/user/friend/' + action,
    data: data,
    success: function(data) {
      console.log(data)

      if (data.status === 'success') {
        $('li[data-id="' + friendId + '"]').remove()
        if ($('.friend-request-btn').length === 0) $('#pt-requests-form').remove()
        if ($('.friend-list-btn').length === 0) $('#pt-friends-form').remove()


      }

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