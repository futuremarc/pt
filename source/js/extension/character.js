var sceneCharacters = {}, characters = {}; //meshes, data
var myCharacter = undefined
var _id = _id

//


function createMyCharacter(data) {

  createCharacter(data, function(character) {

    myCharacter = character
    myCharacter.awake()
    setCameraZoom(character)
    setCameraPos()

    if (isRegistered()) {
      addLiveCharacters()
      emitJoinMsg()
    }
    animate()
  })
}


//


function createCharacter(data, cB) {

  if (isExtension) var path = chrome.extension.getURL('public/models/eva-animated.json')
  else var path = '/models/eva-animated.json'

  loader.load(path, function(geometry, materials) {

    materials.forEach(function(material) {
      material.skinning = true;
      material.depthTest = false;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    var name = data.name || ''

    character.name = name
    character.nameTag = $('<div class="pt-name-tag pt">' + name + '</div>')

    var nameTag = character.nameTag
    $('body').prepend(nameTag)


    var isMe = (renderOrder === 0)
    if (isMe) character.isMe = true

    character.menu = addCharacterMenu(character, data)
    character.role = 'character' //associate purpose for all meshes
    character.hasPointer = false
    character.hasMenu = false
    character.data = data
    character.mixer = new THREE.AnimationMixer(character);
    character.actions = {};
    character.mixer;
    character.animations = ['idle', 'walk', 'run', 'hello', 'pose'];
    character.activeState = 'idle';

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

    character.fadeAction = function(name) {

      var from = this.actions[this.activeState].play();
      var to = this.actions[name].play();

      from.enabled = true;
      to.enabled = true;
      if (to.loop === THREE.LoopOnce) to.reset();
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
      actions[action].enabled = true;
    }

    actions.hello.setLoop(THREE.LoopOnce, 0);
    actions.hello.clampWhenFinished = true;

    actions.idle.play();

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

    if (cB) cB(character)

  });

}


//


function updateCharacter(request, data, cB) {

  var pos, rot, data = data || {}

  console.log('updateCharacter', data)

  switch (request) {

    case 'getLocal':

      chrome.storage.sync.get('pt-user', function(data) {

        var user = data['pt-user']

        if (!user){
          updateCharacter('getRemote',null,cB)
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

      break

    case 'putRemote':

      var name = data.name

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

      break

    case 'putLocal':

      var pos = getCharacterPos()
      var rot = getCharacterRot()

      myCharacter.data.position = pos
      myCharacter.data.rotation = rot

      if (isExtension) chrome.storage.sync.set({
        'pt-user': myCharacter.data
      }, function() {
        if (cB) cB(data)
      })

      break

    case 'getRemote':

      if (!_id && !data._id && !myCharacter) { //_id from pug, id from passed data, id from character
        if (cB) cB(null)
        return
      }

      var name = _id || data.name || myCharacter.data.name
      var errorMessage = $('.error-message h3')

      $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/user/' + name,
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

  var info = {
    'liveFriends': liveFriends,
    'position': pos,
    'rotation': rot,
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
    data: data
  })

  $('body').append(menu)
  menu.html(html)

  menu.find('.pt-menu-hide').click(function() {
    character.nameTag.remove()
    character.menu.remove()
    sceneCharacters.remove(character)
  })
  menu.find('.pt-menu-friend, .pt-menu-settings, .pt-menu-home, .pt-menu-login, .pt-menu-signup, .pt-menu-logout').click(openIframe)
  menu.click(function(e) {
    e.stopPropagation()
  })
  menu.find('a').click(function(e) {
    hideMenu()
  })

  return menu

}



//


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