function emitMsgToBg(data) {
  console.log('emit', data)
  chrome.runtime.sendMessage(data);
}


//


function onSocket(data) {
  var event = data.event
  socketEvents[event](data)
}


//


function logout(cB) {

  if (isRegistered()) emitLeaveMsg()

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

    emitMsgToBg(data)
  })
}


function emitLeaveMsg() {

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

    emitMsgToBg(data)
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


function addMainMenu(mesh,data) {

  data = data.data

  var menu = $('<div class="pt-menu pt"></div>')

  var isMainMenu = mesh.isMe || mesh.role === 'menu'

  var html = Templates.extension.addMenu({
    isMe: isMainMenu,
    data: data
  })

  console.log('addMainMenu',data)

  mesh.menu = menu
  $('body').append(menu)
  menu.html(html)

  menu.find('.pt-menu-hide-pt').click(closePt)
  menu.find('.pt-menu-friend, .pt-menu-settings, .pt-menu-home, .pt-menu-login, .pt-menu-signup, .pt-menu-logout').click(openIframe)
  menu.click(function(e) {
    e.stopPropagation()
  })
  menu.find('div').click(function(e) {
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

  $(container).click(function(e) {
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

  console.log('addMenuIcon', data, num_requests)

  if (num_requests > 0) badge.show()

}


//


function addNotificationBadge(container){

}


//


function openIframe(e) {

  e.stopPropagation()
  var target = e.currentTarget
  var isMe = $(target).closest('ul').data('is-me')
  var role = $(target).find('div').data('role')
  var iframe = document.createElement('iframe')
  var src = 'http://localhost:8080/' + role


  closeIframe()
  $(iframe).attr('frameborder', 0)
  $(iframe).attr('src', src)
  $(iframe).data('role', role)
  $(iframe).addClass('pt-iframe pt')
  $(iframe).click(function(e) {
    e.stopPropagation()
  })

  $('body').append(iframe)

  // iframe.onload = function() {
  //   var content = $(iframe).contents()
  //   content.find('form').on('submit', function(e) {})
  //   content.find('form').on('keyup', function(e) {})
  // }

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
  if(mesh.role === 'menu') menu.css('left', pos.x *3)
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