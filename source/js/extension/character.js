var sceneCharacters = {},
  characters = {}; //meshes, data
var myCharacter = undefined
var _id = _id //from pug

//


function createMyCharacter(data) {

  createCharacter(data, function(character) {

    window.myCharacter = character

    setScenePosition(character)
    addHome(function() {

      //addMainMenu(character, character.data)
      // showNameTags()
      // hideNameTags()


      myCharacter.awake()

      if (isRegistered()) {
        addLiveCharacters()
        emitJoinMsg()
      }

      animate()

      if (isHomePage && scene.visible) $('.pt-menu-suggestions').click() //show default card... isHome defined in auth/home.js

    })

  })
}


//


function createCharacter(data, cB) {

  if (isExtension) var path = chrome.extension.getURL('public/models/character/eva-animated.json')
  else var path = '/models/character/eva-animated.json'

  var loader = new THREE.JSONLoader()
  loader.load(path, function(geometry, materials) {

    materials.forEach(function(material) {
      material.skinning = true;
      material.depthTest = false;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    var name = data.name || ''

    var isMe = (renderOrder === 0)
    if (isMe) character.isMe = true

    character.name = name


    if (isMe) name = '&#x25BC;'

    var nameTagElt = '<div class="pt-name-tag">' + name + '</div>'

    character.nameTag = $('<div class="pt-name-tag-con pt">' + nameTagElt + '</div>')

    var nameTag = character.nameTag

    $('body').prepend(nameTag)

    character.data = data
    character.nameTagWidth = $('.pt-name-tag').width()
    character.menu = addCharacterMenu(character, data)
    character.iframe = addIframe(character)
    character.role = 'character' //associate purpose for all meshes

    character.mixer = new THREE.AnimationMixer(character);
    character.actions = {};
    character.animations = ['idle', 'walk', 'run', 'hello', 'pose'];
    character.activeState = 'idle';

    character.x_scale = 1
    character.y_scale = 1
    character.z_scale = 1

    var xZoom = character.x_scale * zoomFactor
    var yZoom = character.y_scale * zoomFactor
    var zZoom = character.z_scale * zoomFactor

    character.scale.set(xZoom, yZoom, zZoom)

    geometry.computeBoundingBox();
    character.geometry = geometry

    character.height = Math.abs(geometry.boundingBox.max.y - geometry.boundingBox.min.y)
    character.width = Math.abs(geometry.boundingBox.max.x - geometry.boundingBox.min.x)
    character.depth = Math.abs(geometry.boundingBox.max.z - geometry.boundingBox.min.z)

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

    character.walk = function(data) {
      var direction = data.direction

      if (direction === 'right') var dir = 1
      else var dir = -1

      this.rotation.y = dir * Math.PI / 2
      this.fadeAction(this.animations[2])

      if (!this.isWalking && character.hasMenu) character.menu.hide()
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

    character.idle = function() {
      this.fadeAction(this.animations[0])
    }

    character.sleep = function() {
      this.data.isLive = false
      this.material.materials[0].transparent = true
      this.material.materials[0].opacity = .35
    }

    character.awake = function() {
      this.data.isLive = true
      this.material.materials[0].transparent = false
      this.material.materials[0].opacity = 1
    }

    character.faceForward = function() {
      this.rotation.set(0, Math.PI * 2, 0)
    }

    character.faceBackward = function() {
      this.rotation.set(0, Math.PI, 0)
    }

    character.fadeAction = function(action) {

      var from = this.actions[this.activeState].play();
      var to = this.actions[action].play();

      from.enabled = true;
      to.enabled = true;
      if (to.loop === THREE.LoopOnce) to.reset();
      from.crossFadeTo(to, 0.3);
      this.activeState = action;

    }

    this.mixer.addEventListener('finished', character.idle.bind(character)); //return to idle when any animation finishes


    renderOrder -= 1
    character.renderOrder = renderOrder

    var x = 5 - (Math.random() * 5 - 2.5)

    var pos = data.position || {
        x: x,
        y: -1,
        z: 0
      },
      rot = data.rotation || {
        x: 0,
        y: Math.PI * 2,
        z: 0
      }

    character.position.set(pos.x, pos.y, pos.z);
    character.rotation.set(rot.x, rot.y, rot.z);

    sceneCharacters.add(character)
    characters[data._id] = character

    character.hasPointer = true
    character.hasMenu = true
    character.hasIframe = true

    if (cB) cB(character)

  });

}


//


function updateCharacter(request, data, cB, isRecursiveCall) {

  var pos, rot, data = data || {}

  console.log('updateCharacter', data)

  switch (request) {

    case 'getLocal':

      if (isExtension) {

        chrome.storage.sync.get('pt-user', function(data) {

          var user = data['pt-user']
          if (!user) {

            if (!isRecursiveCall) updateCharacter('getRemote', null, cB, true) //if not recursive try different method
            else if (cB) cB(user) //else if recursive call continue without user data
            return
          }

          pos = user.position
          rot = user.rotation

          if (!pos && !rot) return

          if (myCharacter) {

            myCharacter.position.set(pos.x, pos.y, pos.z)
            myCharacter.rotation.set(rot.x, rot.y, rot.z)
            myCharacter.data = user

          }

          if (cB) cB(user)
        })
      } else {

        data = localStorage.getItem('pt-user')
        var user = JSON.parse(data)

        if (!user) {
          if (!isRecursiveCall) updateCharacter('getRemote', null, cB, true)
          else if (cB) cB(user)
          return
        }

        pos = user.position
        rot = user.rotation

        if (!pos && !rot) return

        if (myCharacter) {

          myCharacter.position.set(pos.x, pos.y, pos.z)
          myCharacter.rotation.set(rot.x, rot.y, rot.z)
          myCharacter.data = user

        }

        if (cB) cB(user)

      }

      break

    case 'putRemote':

      var name = data.name

      $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/api/users/' + name,
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

      if (isExtension) {
        chrome.storage.sync.set({
          'pt-user': myCharacter.data
        }, function() {
          if (cB) cB(data)
        })

      } else {
        var myData = JSON.stringify(myCharacter.data)
        localStorage.setItem('pt-user', myData);
      }

      break

    case 'getRemote':

      if (!_id && !data._id && !myCharacter) { //_id from pug, id from passed data, id from character

        data = localStorage.getItem('pt-user')
        var user = JSON.parse(data)

        if (user) {
          if (!isRecursiveCall) updateCharacter('getLocal', null, cB, true)
          else if (cB) cB(user)
          return
        }

        if (cB) cB(null)
        return
      }

      var name = _id || data.name || myCharacter.data.name
      var errorMessage = $('.error-message h3')

      $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/users/' + name,
        success: function(data) {
          console.log(data)

          if (data.status === 'success') {

            if (!isExtension) {

              if (isRegistered()) myCharacter.data = data.data
              if (cB) cB(data.data)
              return

            }

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

    case false:

      pos = data.position
      rot = data.rotation

      myCharacter.position.set(pos.x, pos.y, pos.z)
      myCharacter.rotation.set(rot.x, rot.y, rot.z)
      myCharacter.data = data

  }

}


//


function putCharacter(cB) {

  updateCharacter('putLocal', myCharacter.data)
  if (isRegistered()) updateCharacter('putRemote', myCharacter.data, cB)
}


//


function getCharacterInfo() {


  if (!isRegistered()) return false

  var liveFriends = getLiveFriends()
  var pos = getCharacterPos()
  var rot = getCharacterRot()
  var id = myCharacter.data._id
  var name = myCharacter.data.name
  var room = myCharacter.data.room

  var info = {
    'liveFriends': liveFriends,
    'position': pos,
    'rotation': rot,
    'room': room,
    'name': name,
    '_id': id
  }

  return info
}


//


function addCharacterMenu(character, data) {

  var menu = $('<div class="pt-menu pt"></div>')
  var isMe = character.isMe
  var html = Templates.extension.addMenu({
    isMe: isMe,
    isExtension: true,
    data: data
  })

  $('body').prepend(menu)
  menu.html(html)


  menu.find('.pt-menu-hide').on('mouseup touchend', function() {
    character.nameTag.remove()
    character.menu.remove()
    sceneCharacters.remove(character)
  })

  menu.find('.pt-menu-hide-pt').on('mouseup touchend', closePt)
  menu.find('.pt-menu-zoom').on('mouseup touchend', zoomPt)
  menu.find('.pt-menu-item').on('mouseup touchend', openIframe)
  menu.find('.pt-return-home').on('mouseup touchend', returnHome)
  menu.on('mouseup touchend', function(e) {
    e.stopPropagation()
  })

  menu.find('div').not('.pt-menu-zoom').on('mouseup touchend', hideMenu)

  return menu

}


//


var iframes = {}

function addIframe(character) {

  var iframe = $(document.createElement('iframe'))
  iframe.character = character

  iframe.attr('frameborder', 0)
  iframe.attr('data-is-me', character.isMe)

  iframe.addClass('pt-iframe pt')
  iframe.isMinimized = false

  iframe.on('load', function() {

    $(this).contents().find("body").on('mouseup touchend', function(e) {
      window.isMouseDown = false
    })
  })

  $('body').prepend(iframe)

  if ((!character.data && character.isMe)) return iframe

  iframe.attr('data-user', character.data._id)

  if (!character.data.room) {

    character.data.room = {
      _id: '0',
      name: 'default'
    }
  }

  iframe.attr('data-id', character.data.room._id)
  iframes[character.data.room._id] = iframe

  return iframe
}

function removeCharacter(data) {
  characters[data._id].nameTag.remove()

  sceneCharacters.remove(characters[data._id])
  delete characters[data._id]
}



//


function getCharacterRot() {

  var rot = {
    'x': myCharacter.rotation.x,
    'y': myCharacter.rotation.y,
    'z': myCharacter.rotation.z
  }

  return rot
}


//


function getCharacterPos() {

  var pos = {
    'x': myCharacter.position.x,
    'y': myCharacter.position.y,
    'z': myCharacter.position.z
  }

  return pos
}