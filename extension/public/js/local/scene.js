var textureLoader = new THREE.TextureLoader(),
  loader = new THREE.JSONLoader();

var clock, container, camera, scene, light, renderer, controls = {};
var myCharacter, hoveredMesh = undefined
var projector = new THREE.Projector()
var renderOrder = 0

//


function initScene(data) {

  var data = data || {}

  clock = new THREE.Clock();
  scene = new THREE.Scene();

  var options = {
    antialias: true,
    alpha: true
  }

  renderer = isWebGL() ? new THREE.WebGLRenderer(options) : new THREE.CanvasRenderer(options);

  container = document.getElementById('pt-container');

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  container.appendChild(renderer.domElement);
  $(renderer.domElement).addClass('pt-override-page')

  camera = new THREE.OrthographicCamera(container.offsetWidth / -2, container.offsetWidth / 2, container.offsetHeight / 2, container.offsetHeight / -2, .1, 1000);
  camera.position.set(0, 1.25, 2)

  light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  sceneCharacters = new THREE.Object3D();
  scene.add(sceneCharacters);

  createMyCharacter(data)
  addDomListeners()

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

  mesh.role = 'menu'
  mesh.position.set(0, -2, 0)
  mesh.renderOrder = 1
  mesh.visible = false

  scene.add(mesh)
  addMainMenu(mesh,data)

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


//


function setSceneOffset() {

  var newOrigin = new THREE.Vector3(0, window.innerHeight, 0)
  var screenOffset = screenToWorld(newOrigin)
  scene.position.set(screenOffset.x, 0, 0)

}


//


function zoomInScene() {
  $(container).addClass('pt-enlarge')
  $(renderer.domElement).addClass('pt-enlarge')
  setCameraZoom()
  onWindowResize()
}


//


function zoomOutScene() {
  $(renderer.domElement).removeClass('pt-enlarge')
  $(container).removeClass('pt-enlarge')
  setCameraZoom()
  onWindowResize()
}