var clock, container, camera, scene, renderer, controls, listener;

var character;
var light;
var textureLoader = new THREE.TextureLoader();
var loader = new THREE.JSONLoader();
var action = {},
  mixer;
var activeState = 'idle';

var animations = ['idle', 'walk', 'run', 'hello'];

function init() {

  clock = new THREE.Clock();
  scene = new THREE.Scene();
  container = document.getElementById('pt-avatar');
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
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
    hoveredCharacter = undefined

    mixer = new THREE.AnimationMixer(character);
    character.rotateY(Math.PI / 2);

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
    characters.position.set(0, -1, 0)
    var box = new THREE.Box3().setFromObject(characters);
    box.center(characters.position);
    characters.localToWorld(box);
    characters.position.multiplyScalar(-1);


    camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
      container.offsetHeight / (box.max.y - box.min.y)) * .8;
    camera.updateProjectionMatrix();
    camera.updateMatrix();

    document.addEventListener('keydown', walk, false);
    document.addEventListener('keyup', stop, false);
    //window.addEventListener('mousemove', detectHover, false);
    
    animate();
    action.idle.play();
  });
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

function stop(e) {
  var keyCode = e.keyCode;
  if (keyCode === 39) {
    if (key.right) fadeAction(animations[0])
    key.right = false;
  } else if (keyCode === 37) {
    if (key.left) fadeAction(animations[0])
    key.left = false;
  }
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
        $('body').addClass('hovering')
      }

    } else {
      if (hoveredCharacter) {
        hoveredCharacter = undefined;
        $('body').removeClass('hovering')
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


$('<div id="pt-avatar"></div>').appendTo('body');

init();



/********* HELPERS *********/

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
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
