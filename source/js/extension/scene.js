
var clock, container, camera, scene, light, renderer, controls = {};
var hoveredMesh = undefined
var projector = new THREE.Projector()
var renderOrder = 0

//

var canvas_height

function initScene(data) {

  var data = data || {}

  console.log('initScene', data)

  clock = new THREE.Clock();
  scene = new THREE.Scene();

  var options = {
    antialias: true,
    alpha: true
  }

  renderer = isWebGL() ? new THREE.WebGLRenderer(options) : new THREE.CanvasRenderer(options);

  container = document.getElementById('pt-container');
  canvas_height = $(container).height()

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  container.appendChild(renderer.domElement);
  $(renderer.domElement).addClass('pt-override-page')

  camera = new THREE.OrthographicCamera(container.offsetWidth / -2, container.offsetWidth / 2, container.offsetHeight / 2, container.offsetHeight / -2, .1, 1000);
  camera.position.set(0, 1.25, 2)

  light = new THREE.AmbientLight(0xffffff, 1);
  //light.position.set(0,1.25,2)
  scene.add(light);

  sceneCharacters = new THREE.Object3D();
  scene.add(sceneCharacters);

  createMyCharacter(data)
  addDomListeners()

}

var windowCenter


//


function computeWindowCenter() {

  var vec = new THREE.Vector3(window.innerWidth, -1, 0)
  windowCenter = screenToWorld(vec)

  console.log('computeWindowCenter', windowCenter)
  return windowCenter

}


//


function setCameraZoom(data) {

  //box serves as anchor for perspective and menu
  var box = new THREE.BoxGeometry(1, 2, 1)
  mesh = new THREE.Mesh(box, new THREE.MeshBasicMaterial({
    'color': 0x7ec0ee,
    'transparent': true,
    'opacity': .8
  }))

  box.computeBoundingBox()
  mesh.geometry = box
  mesh.role = 'menu'
  mesh.position.set(0, -2, 0)
  mesh.renderOrder = 1
  mesh.visible = false

  scene.add(mesh)
  sceneCharacters.position.set(0, 1, 0);

  var box = new THREE.Box3().setFromObject(mesh);
  box.center(mesh.position);
  mesh.localToWorld(box);
  mesh.position.multiplyScalar(-1);

  camera.zoom = Math.min(container.offsetWidth / (box.max.x - box.min.x),
    container.offsetHeight / (box.max.y - box.min.y)) * .8;

  camera.updateProjectionMatrix();
  camera.updateMatrix();

  setSceneOffset()
  mesh.position.set(.25, -.1, 0) //.85 old y value

}

var home

function addHome(cB) {

  if (isExtension) var path = chrome.extension.getURL('public/models/home/house.json')
  else var path = '/models/home/house.json'


  var loader = new THREE.ObjectLoader();
  loader.load(path, function(object) {

    object.role = 'home'
    object.position.set(2, -2, 0)
    object.rotation.set(0, Math.PI, 0)

    object.renderOrder = 1

    scene.add(object)

    object.scale.set(.1, .1, .1)

    home = object

    if (cB) cB()

  })
}


//


function setSceneOffset() {

  var newOrigin = new THREE.Vector3(0, window.innerHeight, 0)
  var screenOffset = screenToWorld(newOrigin)
  scene.position.set(screenOffset.x, 0, 0)

}