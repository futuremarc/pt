var isExtension = (chrome.storage !== undefined) //check if inside extension
var isIframe = window.parent !== window.self
var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))

if (!isExtension && !isIframe) {

  var socket = io('https://passti.me', {
    'path': '/socket',
    'forceNew': true
  })

  initSockets()

}


if (!isMobile && !isIframe && chrome.app && !chrome.app.isInstalled) $('#pt-install-tag').hide()

//


function emitMsg(data) {
  console.log('emit', data)
  if (isExtension) chrome.runtime.sendMessage(data);
  else emitSocket(data)
}


//

function emitSocket(data) {
  socket.emit(data.event, data)
}


//


function initSockets() {

  var events = ['chat', 'post', 'action', 'join', 'leave', 'connect', 'reconnect', 'disconnect', 'friend', 'request']

  events.forEach(function(event) {

    socket.on(event, function(data) {

      var data = data || {}

      if (data === 'transport close' || event === 'reconnect') { //customize disconnect/reconnect messages
        var data = {
          event: event,
          data: data
        }
      }

      data.event = event
      data.type = 'socket'
      console.log(data)
      onSocket(data)
    })
  })
}



function onSocket(data) {
  var event = data.event
  socketEvents[event](data)
}


//


function logout(cB) {

  if (isRegistered()) emitLeaveMsg()

  if (!isExtension) {
    if (cB) cB()
    return
  }

  chrome.storage.sync.set({
    'pt-user': {}
  }, function() {
    if (cB) cB()
  })

}


//


function emitJoinMsg() {

  putCharacter(function() {

    var info = getCharacterInfo()

    var data = {
      'type': 'socket',
      'event': 'join',
      '_id': info._id,
      'position': info.position,
      'rotation': info.rotation,
      'name': info.name,
      'action': 'awake',
      'liveFriends': info.liveFriends
    }

    emitMsg(data)
  })
}


function emitLeaveMsg() {

  myCharacter.data.isLive = false
  putCharacter(function() {

    var info = getCharacterInfo()

    var data = {
      'type': 'socket',
      'event': 'leave',
      '_id': info._id,
      'position': info.position,
      'rotation': info.rotation,
      'name': info.name,
      'liveFriends': info.liveFriends
    }

    emitMsg(data)
  })
}


//


function isQuickGesture(keyCode) { //wave
  return (keyCode === 38)
}


//


function isGesture(keyCode) { //wave, pose
  return keyCode === 38 || keyCode === 40
}


//


function isRegistered() {
  if (!myCharacter) return false
  if (!myCharacter.data) return false
  return myCharacter.data._id
}


//


function screenToWorld(screenPos) {

  var halfConWidth = container.offsetWidth / 2
  var halfConHeight = container.offsetHeight / 2
  var worldPos = screenPos.clone();

  worldPos.x = worldPos.x / halfConWidth - 1;
  worldPos.y = -worldPos.y / halfConHeight + 1;
  projector.unprojectVector(worldPos, camera);

  return worldPos;
}


//


function worldToScreen(worldPos) {

  var halfConWidth = container.offsetWidth / 2
  var halfConHeight = window.innerHeight / 2
  var screenPos = worldPos.clone();

  projector.projectVector(screenPos, camera);
  screenPos.x = (screenPos.x) * halfConWidth;
  screenPos.y = (-screenPos.y) * halfConHeight;

  return screenPos;
}


//


function showSceneBg() {
  renderer.setClearColor(0xdddddd, .5);
}


//


function hideSceneBg() {
  renderer.setClearColor(0xffffff, 0);
}


//


function showNameTags() {

  $('.pt-name-tag').show()

  for (var character in characters) {

    var user = characters[character]

    if (user.visible) {

      var pos = worldToScreen(user.position)
      user.nameTag.css('left', pos.x - 15) //TO DO: calculate centering nameTag

    } else {
      user.nameTag.hide()
    }
  }

  isNameDisplayed = true
}


//


function hideNameTags() {

  $('.pt-name-tag').hide()
  isNameDisplayed = false
}


//


function addCanvasToPage() {
  $('<div id="pt-container" class="pt-override-page pt"></div>').appendTo('body');
}


//


function addMainMenu(mesh, data) {

  var menu = $('<div class="pt-menu pt"></div>')

  var isMainMenu = mesh.isMe || mesh.role === 'menu'

  var html = Templates.extension.addMenu({
    isMe: isMainMenu,
    data: data
  })

  mesh.menu = menu
  $('body').append(menu)
  menu.html(html)

  menu.find('.pt-menu-hide-pt').on('click touchstart', closePt)
  menu.find('.pt-menu-friend, .pt-menu-settings, .pt-menu-home, .pt-menu-login, .pt-menu-signup, .pt-menu-logout').on('click touchstart', openIframe)
  menu.on('click touchstart', function(e) {
    e.stopPropagation()
  })
  menu.find('div').on('click touchstart', function(e) {
    hideMenu()
  })

  addMenuIcon(data)
}



//


function addMenuIcon(data) {

  var icon = $('<span>&#9776;</span>')
  var badge = $('<span class="pt-notification-counter"></span>')
  var container = $('<div class="pt-menu-icon pt"></div>')
  var requests = data.friendRequests || []
  var num_requests = requests.length

  $(container).on('click touchstart', function(e) {
    e.stopPropagation()
  })

  $(container).on('mouseenter', function() {
    showMenu(mesh)
    hideNameTags()
  })

  var notifications = num_requests
  badge.text(notifications)

  container.append(icon)
  container.append(badge)
  $('body').append(container)

  if (num_requests > 0) badge.show()

}


//


function removeMenuIcon() {
  $('.pt-menu-icon').remove()
}


//


function removeMainMenu() {
  $('.pt-menu').remove()
  removeMenuIcon()
}


//


function getFriendInfo(idOrName, cB) {

  $.ajax({
    method: 'GET',
    url: 'https://passti.me/api/user/' + idOrName,
    success: function(data) {
      console.log(data)

      if (data.status === 'success') {
        var user = data.data

        if (cB) cB(user)
        return user
      }
    },
    error: function(err) {
      console.log(err)
    }
  })
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


function getRemoteLiveFriends(cB) {

  var liveFriends = {}

  updateCharacter('getRemote', null, function(character) {

    console.log('getRemoteLiveFriends', character)

    character.friends.forEach(function(friend) {
      var friend = friend.user
      if (friend.isLive) liveFriends[friend._id] = friend._id
    })

    console.log('liveFriends', liveFriends, 'character', character)

    if (cB) cB(liveFriends)
  })
}


//


function refreshMainMenu() {

  updateCharacter('getRemote', null, function(character) {
    removeMainMenu()
    addMainMenu(mesh, character)
  })
}



//


function addLiveCharacters() {

  updateCharacter('getRemote', null, function(character) {

    console.log('addLiveCharacters', character, character.friends)

    character.friends.forEach(function(friend) {

      var friend = friend.user
      if (friend.isLive) createCharacter(friend)
    })
  })
}


//


function removeLiveCharacters() {

  for (var character in characters) {
    removeCharacter(characters[character].data)
  }

}


//


function openIframe(e) {

  e.stopPropagation()
  var target = e.currentTarget
  var isMe = $(target).closest('ul').data('is-me')
  var role = $(target).find('div').data('role')
  var iframe = document.createElement('iframe')
  var src = 'https://passti.me/' + role


  closeIframe()
  $(iframe).attr('frameborder', 0)
  $(iframe).attr('src', src)
  $(iframe).data('role', role)
  $(iframe).addClass('pt-iframe pt')
  $(iframe).on('click touchstart', function(e) {
    e.stopPropagation()
  })

  $('body').append(iframe)

}


//



function onExternalMsg(data, sender, sendResponse) {
  data.fromExtension = true
  if (sendResponse) sendResponse(data)
  console.log('extension sent', data, sendResponse != undefined)

}


//


function toggleMenu(e) {
  e.preventDefault()
  $('.pt-menu').toggle();
}


//


function showPointer() {
  $('body').addClass('pt-hovering')
  isMousePointer = true
}


//


function hidePointer() {
  $('body').removeClass('pt-hovering')
  isMousePointer = false
}


//


function onDocumentClick() {
  closeIframe()
  hideMenu()
}


//


function closeIframe() {
  $('.pt-iframe').remove();
}


//
var isMenuDisplayed = false

function showMenu(mesh) {

  if (!mesh) return

  hideMenu()
  var pos = worldToScreen(mesh.position)
  var menu = mesh.menu

  menu.css('left', pos.x)
  if (mesh.role === 'menu') menu.css('left', pos.x * 3)
  menu.show();
  isMenuDisplayed = true
}


//


function hideMenu() {
  $('.pt-menu').hide();
  isMenuDisplayed = false
}


//


function closePt() {
  $('.pt').remove()
  removeDomListeners()
}

//


function changeSubmitButton(disable, replaceText, id) {
  if (!id) var btn = $("input[type='submit']")
  else var btn = $(id)

  if (replaceText) {
    if (!btn.val()) btn.html(replaceText)
    else btn.val(replaceText)
  }

  btn.attr('disabled', disable)
}


//


function toggleCanvas() {
  $('#pt-container').toggle()
}



//


function isWebGL() {
  try {
    var canvas = document.createElement("canvas");
    return !!
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"));
  } catch (e) {
    return false;
  }
}