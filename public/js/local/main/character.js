var sceneCharacters = {}, //
  characters = {}; //meshes, data
var myCharacter = undefined
var _id = _id //from pug

//


function createMyCharacter(data) {

  createCharacter(data, function(character) {

    window.myCharacter = character

    setScenePosition(character)
      // addHome(function() {

    //addMainMenu(character, character.data)
    // showNameTags()
    // hideNameTags()


    myCharacter.awake()

    if (isRegistered()) {
      addLiveCharacters()
      updateBgCharacterData()
      emitJoinMsg()

    }

    animate()

    if (isHomePage && scene.visible) $('.pt-menu-suggestions').click() //show default card... isHome defined in auth/home.js

    // })

  })
}


//


function createCharacter(data, callBack) {

  if (isExtension) var path = chrome.extension.getURL('public/models/character/eva-animated.json')
  else var path = '/models/character/eva-animated.json'

  var loader = new THREE.JSONLoader()
  loader.load(path, function(geometry, materials) {

    materials.forEach(function(material) {
      material.skinning = true;
      material.depthTest = false;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));

    var bounceTimer = 0

    character.bounceIcon = function(icon) {

      setTimeout(function() {

        var originalY = .65

        var start = new TWEEN.Tween(icon.position).to({
          y: originalY
        }, 200).easing(TWEEN.Easing.Quadratic.Out);

        icon.bounceTween = new TWEEN.Tween(icon.position).to({
          y: originalY + .045
        }, 1500).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Sinusoidal.InOut);

        start.chain(icon.bounceTween).start();

      }, bounceTimer)

      bounceTimer += 950
    }


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
    character.menu = addCharacterMenu(character)

    character.iframe = addIframe(character)
    character.bubble = addBubble(character) //notification bubble
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

    character.zoomInIcon = function(icon) {

      new TWEEN.Tween(icon.scale).to({
        x: 1,
        y: 1,
        z: 1
      }, 400).easing(TWEEN.Easing.Elastic.Out).start();

    }

    character.zoomOutIcon = function(icon) {

      new TWEEN.Tween(icon.scale).to({
        x: .01,
        y: .01,
        z: .01
      }, 400).easing(TWEEN.Easing.Elastic.Out).start();

    }

    character.zoomInMenu = function() {
      this.zoomInIcon(this.menu3d.roomIcon)
      this.zoomInIcon(this.menu3d.usersIcon)
    }

    character.zoomOutMenu = function() {
      this.zoomOutIcon(this.menu3d.roomIcon)
      this.zoomOutIcon(this.menu3d.usersIcon)
    }

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
      this.menu3d.roomIcon.material.opacity = .35
      this.menu3d.usersIcon.material.opacity = .35
    }

    character.awake = function() {
      this.data.isLive = true
      this.material.materials[0].transparent = false
      this.material.materials[0].opacity = 1   
      this.menu3d.roomIcon.material.opacity = 1
      this.menu3d.usersIcon.material.opacity = 1
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

    character.hasPointer = true
    character.hasMenu = true
    character.hasIframe = true
    character.hasBubble = true

    sceneCharacters.add(character)
    characters[data._id] = character

    character.menu_3d = addMenu(character, function() {
      if (callBack) callBack(character)
    })

  });

}


//


function updateCharacter(request, data, callBack, isRecursiveCall) {

  var pos, rot
  var data = data || {}

  console.log('updateCharacter', request, data)

  switch (request) {

    case 'getLocal':

      if (isExtension) {

        chrome.storage.sync.get('pt-user', function(_data) {

          var user = _data['pt-user']

          if (!user) {

            if (!isRecursiveCall) updateCharacter('getRemote', null, callBack, true) //if not recursive try different method
            else if (callBack) callBack(user) //else if recursive call continue without user data
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

          if (callBack) callBack(user)
        })
      } else {

        data = localStorage.getItem('pt-user')
        var user = JSON.parse(data)

        if (!user) {
          if (!isRecursiveCall) updateCharacter('getRemote', null, callBack, true)
          else if (callBack) callBack(user)
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

        if (callBack) callBack(user)

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
          if (callBack) callBack(data.data)
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

          if (callBack) callBack(data)
        })

      } else {

        var _data = JSON.stringify(myCharacter.data)
        localStorage.setItem('pt-user', _data);

        if (callBack) callBack(data)

      }

      break

    case 'getRemote':

      if (!_id && !data._id && !myCharacter) { //_id from pug, id from passed data, id from character

        data = localStorage.getItem('pt-user')
        var user = JSON.parse(data)

        if (user) {
          if (!isRecursiveCall) updateCharacter('getLocal', null, callBack, true)
          else if (callBack) callBack(user)
          return
        }

        if (callBack) callBack(null)
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
              if (callBack) callBack(data.data)
              return

            }

            chrome.storage.sync.set({
              'pt-user': data.data

            }, function() {
              if (isRegistered()) myCharacter.data = data.data
              if (callBack) callBack(data.data)
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


function putCharacter(callBack) {

  updateCharacter('putLocal', myCharacter.data)
  if (isRegistered()) updateCharacter('putRemote', myCharacter.data, callBack)
}


//


function getCharacterInfo(callBack) {

  if (!isRegistered()) return false

  if (!callBack) {

    var pos = getCharacterPos()
    var rot = getCharacterRot()
    var id = myCharacter.data._id
    var name = myCharacter.data.name
    var room = myCharacter.data.room
    var liveFriends = getLiveFriends()

    var info = {
      'liveFriends': liveFriends,
      'position': pos,
      'rotation': rot,
      'room': room,
      'name': name,
      '_id': id
    }
    console.log('getCharacterInfo', info)
    return info
  } else {


    getLiveFriends(function(liveFriends) {

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

      return callBack(info)

    })

  }

}


//

function addMenu(character, callBack) {

  var menu3d = new THREE.Object3D()
  character.menu3d = menu3d
  sceneCharacters.add(menu3d)


  //load bubble icon
  var loader = new THREE.TextureLoader()

  if (isExtension) var path = chrome.extension.getURL('public/img/bubble.png')
  else var path = '/img/extension/bubble.png'

  loader.load(path, function(texture) {

    var geo = new THREE.BoxGeometry(.6, .6, 1)

    var roomIcon = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      'map': texture,
      'transparent': true
    }))

    roomIcon.role = 'room'
    roomIcon.character = character
    roomIcon.scale.set(0.01, 0.01, 0.01)
    roomIcon.hasPointer = true
    roomIcon.isIcon = true

    menu3d.roomIcon = roomIcon
    menu3d.add(roomIcon)
    character.bounceIcon(roomIcon)


    //then load users icon
    var loader = new THREE.TextureLoader()

    if (isExtension) var path = chrome.extension.getURL('public/img/users.png')
    else var path = '/img/extension/users.png'

    loader.load(path, function(texture) {

      var geo = new THREE.BoxGeometry(.6, .6, 1)

      var usersIcon = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        'map': texture,
        'transparent': true
      }))

      usersIcon.role = 'users'
      usersIcon.character = character
      usersIcon.scale.set(0.01, 0.01, 0.01)
      usersIcon.hasPointer = true
      usersIcon.isIcon = true

      menu3d.usersIcon = usersIcon
      menu3d.add(usersIcon)

      character.bounceIcon(usersIcon)
      character.hasMenu3D = true

      if (callBack) callBack()

    });


  });


}

function addCharacterMenu(character) {

  var data = character.data

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

  if (isIframe) iframe.on('load', function() {

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