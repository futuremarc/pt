
function isChrome() {
  var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

  if(isIOSChrome){
    return true;
  } else if(isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
    return true;
  } else { 
    return false;
  }
}



if (isChrome() && !isIOSChrome) var isExtension = (chrome && chrome.storage) //check if inside extension
else var isExtension = false

var isIframe = window.parent !== window.self

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

if (!isExtension && !isIframe) {

  var socket = io('http://localhost:5050', {
    'path': '/socket',
    'forceNew': true
  })

  initSockets()

}


if (!isMobile && !isIframe){
  console.log('show tag!')
  $('#pt-install-tag').show()
}else{
  console.log('hide tag!')
  $('#pt-install-tag').hide()
}

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
    url: 'http://localhost:8080/api/user/' + idOrName,
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
  var src = 'http://localhost:8080/' + role


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