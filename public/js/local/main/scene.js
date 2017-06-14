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

  dLight = new THREE.DirectionalLight(0xffffff, .1);
  dLight.position.set(0, 0, 10)
  scene.add(dLight);

  aLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(aLight);

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

  return windowCenter

}


//


function setScenePosition(data) {

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
  mesh.visible = false

  scene.add(mesh)
  sceneCharacters.position.set(0, 1, 0);

  var boxHelper = new THREE.Box3().setFromObject(mesh);
  boxHelper.center(mesh.position);
  mesh.localToWorld(boxHelper);
  mesh.position.multiplyScalar(-1);
  mesh.boxHelper = boxHelper

  setCameraZoom()
  setSceneOffset()
  mesh.position.set(.25, -.1, 0) //.85 old y value

}

function setCameraZoom() {

  var box = mesh.boxHelper
  camera.zoom = (Math.min(container.offsetWidth / (box.max.x - box.min.x),
    container.offsetHeight / (box.max.y - box.min.y)) * .8);

  camera.updateProjectionMatrix();
  camera.updateMatrix();
}

var home

function addHome(cB) {

  if (isExtension) var path = chrome.extension.getURL('public/models/house/house.json')
  else var path = '/models/house/house.json'


  var loader = new THREE.ObjectLoader();
  loader.load(path, function(object) {

    object.role = 'home'
    object.position.set(0, 0, 0)
    object.rotation.set(0, (Math.PI * 3) / 2, 0)

    object.traverse(function(child) {
      child.renderOrder = 100
      if (child.name === 'HemisphereLight') object.remove(child)
    })
    scene.add(object)

    object.x_scale = .3
    object.y_scale = .6
    object.z_scale = .5

    var xZoom = object.x_scale * zoomFactor
    var yZoom = object.y_scale * zoomFactor
    var zZoom = object.z_scale * zoomFactor

    object.scale.set(xZoom, yZoom, zZoom)

    home = object
    home.visible = false

    if (cB) cB()

  })
}


function addBike() {

  if (isExtension) var path = chrome.extension.getURL('public/models/bike/bike.json')
  else var path = '/models/bike/bike.json'


  var loader = new THREE.ObjectLoader();
  loader.load(path, function(object) {

    object.role = 'bike'
    object.position.set(2, 2, 0)
    object.rotation.set(0, (Math.PI * 3) / 2, 0)

    object.traverse(function(child) {
      child.renderOrder = 100

      if (child.name === 'WheelRear_hiProfile') {

        object.rearWheel = child

        var geo = object.rearWheel.children[0].geometry
        geo.computeBoundingBox()

        geo.height = geo.boundingBox.max.y - geo.boundingBox.min.y
        geo.width = geo.boundingBox.max.x - geo.boundingBox.min.x
        geo.depth = geo.boundingBox.max.z - geo.boundingBox.min.z

        geo.applyMatrix(new THREE.Matrix4().makeTranslation(-2, -2, 0));

      } else if (child.name === 'WheelFront_hiProfile') {
        
        object.frontWheel = child
      } else if (child.name === 'HemisphereLight') object.remove(child)
    })

    scene.add(object)

    object.x_scale = 1
    object.y_scale = 1
    object.z_scale = 1

    var xZoom = object.x_scale * zoomFactor
    var yZoom = object.y_scale * zoomFactor
    var zZoom = object.z_scale * zoomFactor

    object.scale.set(xZoom, yZoom, zZoom)

    bike = object

    if (cB) cB()

  })
}


//


function setSceneOffset() {

  var newOrigin = new THREE.Vector3(0, window.innerHeight, 0)
  var screenOffset = screenToWorld(newOrigin)
  scene.position.set(screenOffset.x, 0, 0)

}