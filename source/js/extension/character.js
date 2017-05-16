var sceneCharacters, characters = {}; //meshes, data

//


function createMyCharacter(data) {

  createCharacter(data, function(character) {

    myCharacter = character
    myCharacter.awake()
    setCameraZoom(data)

    if (isRegistered()) {
      addLiveCharacters()
      emitJoinMsg()
    }
    animate()
  })
}


//


function createCharacter(data, cB) {

  loader.load(chrome.extension.getURL('public/models/eva-animated.json'), function(geometry, materials) {

    materials.forEach(function(material) {
      material.skinning = true;
      material.depthTest = false;
    });

    var character = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    var name = data.name

    character.name = name
    character.nameTag = $('<div class="pt-name-tag">' + name + '</div>')

    var nameTag = character.nameTag
    $('body').prepend(nameTag)

    character.purpose = 'character' //associate purpose for all meshes
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
      this.data.isLive = false
      this.material.materials[0].transparent = true
      this.material.materials[0].opacity = .5
    }

    character.awake = function() {
      this.data.isLive = true
      this.material.materials[0].transparent = false
      this.material.materials[0].opacity = 1
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

    characters[data._id] = character
    sceneCharacters.add(character)

    renderOrder -= 1
    character.renderOrder = renderOrder

    var pos = data.position || {
        x: 10,
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


//


function updateCharacter(data, request, cB) {

  var pos, rot, data = data || {}

  switch (request) {

    case 'getLocal':
      chrome.storage.sync.get('pt-user', function(data) {

        var user = data['pt-user']

        pos = user.position
        rot = user.rotation

        if (!pos && !rot) return

        myCharacter.position.set(pos.x, pos.y, pos.z)
        myCharacter.rotation.set(rot.x, rot.y, rot.z)
        myCharacter.data = user
        if (cB) cB(data)
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

      chrome.storage.sync.set({
        'pt-user': myCharacter.data
      }, function() {
        if (cB) cB(data)
      })

      break

    case 'getRemote':
      var name = data.name || myCharacter.data.name
      var errorMessage = $('.error-message h3')

      $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/user/' + name,
        success: function(data) {
          console.log('GET REMOTE', data)

          if (data.status === 'success') {
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
  }

}


//


function putCharacter(cB) {

  updateCharacter(myCharacter.data, 'putLocal')
  if (isRegistered()) updateCharacter(myCharacter.data, 'putRemote', cB)
}


//


function getCharacterInfo() {

  var liveFriends = getLiveFriends()
  var pos = myCharacter.data.position
  var rot = myCharacter.data.rotation
  var id = myCharacter.data._id

  var info = {
    'liveFriends': liveFriends,
    'position': pos,
    'rotation': rot,
    '_id': id
  }

  return info
}


//


function addLiveCharacters() {

  updateCharacter(null, 'getRemote', function(character) {

    character.friends.forEach(function(friend) {

      var friend = friend.user
      if (friend.isLive) createCharacter(friend)
    })

  })
}


//


function removeCharacter(data) {

  scene.remove(sceneCharacters[data._id])
  delete sceneCharacters[data._id]
  delete characters[data._id]
}


//


function getLiveFriends() {

  var liveFriends = {}

  myCharacter.data.friends.forEach(function(friend) {

    var friend = friend.user
    if (friend.isLive) liveFriends[friend._id] = friend._id
  })

  return liveFriends
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

