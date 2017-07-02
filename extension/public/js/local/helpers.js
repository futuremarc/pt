function detectExtensionInstalled(id, callBack) {

  var url = 'chrome-extension://' + id + '/manifest.json'

  $.ajax({
    method: 'GET',
    url: url,
    success: function(data) {
      if (callBack) callBack(true)
    },
    error: function(err) {
      if (callBack) callBack(false)
    },
  })

}


function isChrome() {
  var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

  if (isIOSChrome) {
    return false;
  } else if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
    return true;
  } else {
    return false;
  }
}



if (isChrome()) var isExtension = (chrome && chrome.storage) !== undefined //check if inside extension
else var isExtension = false

var isIframe = window.parent !== window.self

var isMobile = false;
var isHomePage = isHomePage || false

var id = 'cjokaadpcmicjaimmokifhjgikepgjdp' //chrome extension id

function detectMobileOrTablet() {
  var check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};


isMobile = detectMobileOrTablet()

if (!isExtension && !isIframe) {

  var socket = io('https://passti.me', {
    'path': '/socket',
    'forceNew': true
  })

  initSockets()
}

function showBubble(bubble) {
  bubble.isShown = true
  bubble.show()
}

function hideBubble(bubble) {
  bubble.isShown = false
  bubble.hide()
}

function positionBubble(bubble) {

  var _mesh = bubble.character
  var pos = worldToScreen(_mesh.position)
  var x = pos.x

  var data = new THREE.Vector3(0, _mesh.height, 0)
  var pos = worldToScreen(data)
  var y = Math.abs(pos.y)

  var halfWidth = bubble.width() / 2
  bubble.css('left', x - halfWidth)
  bubble.css('bottom', y * menu_y_offset)

}


function addBubble(character) {

  var bubble = $('<div class="pt pt-bubble-container"></div>')

  bubble.character = character
  bubble.attr('data-is-me', character.isMe)
  bubble.isShown = false

  bubble.on('mouseup touchend', function(e) {
    hideBubble(bubble)
    openIframe(e)
  })

  $('body').append(bubble)

  return bubble
}


function updateMenu3DPositions() {


  for (var character in characters) {

    if (!characters[character].hasMenu3D) return

    var roomIcon = characters[character].menu3d.roomIcon
    var usersIcon = characters[character].menu3d.usersIcon

    if (roomIcon) {
      roomIcon.position.copy(characters[character].position);
      roomIcon.position.x = roomIcon.position.x - .4
    }
    if (usersIcon) {
      usersIcon.position.copy(characters[character].position);
      usersIcon.position.x = usersIcon.position.x + .4
    }


    // var isShown = characters[character].bubble.isShown
    // if (isShown) positionIframe(characters[character].bubble)

  }



}

function updateBubblePositions() {

  for (var character in characters) {

    if (!characters[character].hasBubble) return

    var isShown = characters[character].bubble.isShown
    if (isShown) positionIframe(characters[character].bubble)

  }

}

function openBubble(data) {

  var id = data._id

  if (!characters[id]) return

  var bubble = characters[id].bubble
  var notification = Templates.extension.addNotification(data)

  $(bubble).html(notification)

  positionBubble(bubble)
  showBubble(bubble)

  setTimeout(function() {
    hideBubble(bubble)
  }, 10000)

}

function setInstallBtn() {

  if (!isMobile && !isIframe && isChrome() && !isExtension && !hasExtension) {
    $('#pt-install-tag').show()
  } else {
    $('#pt-install-tag').remove()
  }

}

var zoomFactor = .75

function zoomPt() {

  var role = $(this).data('role')

  if (role === 'zoom-out' && zoomFactor > .25) zoomFactor -= .25
  else if (role === 'zoom-in' && zoomFactor < 1.25) zoomFactor += .25


  // $('.pt').not('.pt-menu, .pt-iframe, .pt-menu-icon').css('zoom', zoomFactor)
  // onWindowResize()

  $('.pt-menu-icon').css('zoom', zoomFactor)

  scene.traverse(function(child) {

    var isZoomable = child.x_scale

    if (isZoomable) {

      var xZoom = child.x_scale * zoomFactor
      var yZoom = child.y_scale * zoomFactor
      var zZoom = child.z_scale * zoomFactor

      child.scale.set(xZoom, yZoom, zZoom)
    }
  })

  showNameTags() //reset nametag location
}

function emitMsg(data) {
  console.log('emit', data)
  var isSocket = (data.type === 'socket')

  if (isExtension) chrome.runtime.sendMessage(data);
  else if (isSocket) emitSocket(data)
}


//

function emitSocket(data) {
  socket.emit(data.event, data)
}


//


function initSockets() {

  var events = ['chat', 'post', 'endPost', 'action', 'join', 'leave', 'connect', 'reconnect', 'disconnect', 'friend', 'request']

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
  if (event) socketEvents[event](data)
}


//


function logout(callBack) {

  if (isRegistered()) emitLeaveMsg()

  if (!isExtension) {
    localStorage.removeItem('pt-user')
    if (callBack) callBack()
    return
  }

  chrome.storage.sync.remove('pt-user', function() {
    if (callBack) callBack()
  })

}


//

function updateBgCharacterData() {

  var data = {
    'user': myCharacter.data,
    'type': 'update'
  }

  emitMsg(data)
}

function emitJoinMsg() {

  putCharacter(function(user) {

    getCharacterInfo(function(info) {

      var data = {
        'type': 'socket',
        'event': 'join',
        '_id': info._id,
        'position': info.position,
        'rotation': info.rotation,
        'room': info.room,
        'name': info.name,
        'action': 'awake',
        'liveFriends': info.liveFriends
      }

      emitMsg(data)

    })

  })
}


function emitLeaveMsg() {

  myCharacter.data.isLive = false
  putCharacter(function() {

    getCharacterInfo(function(info) {

      var data = {
        'type': 'socket',
        'event': 'leave',
        '_id': info._id,
        'position': info.position,
        'rotation': info.rotation,
        'room': info.room,
        'name': info.name,
        'liveFriends': info.liveFriends
      }

      emitMsg(data)

    })


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
  var halfConHeight = container.offsetHeight / 2
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


var name_tag_y = 105
var name_tag_x_off = -1

function showNameTags() {

  $('.pt-name-tag').show()

  for (var character in characters) {

    var user = characters[character]

    if (user.visible) {

      var worldPos = new THREE.Vector3(user.position.x, user.height, user.position.z)
      var screenPos = worldToScreen(worldPos)

      var x = screenPos.x - (user.nameTagWidth / 2) + name_tag_x_off //center nametag to user pos
      var y = name_tag_y * zoomFactor //align nametag to height of user based on zoom

      var options = {
        'left': x,
        'bottom': y
      }

      if (x && y) user.nameTag.css(options)
      else hideNameTags()

    } else if (user.nameTag) {
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
  $('<div id="pt-container" class="pt-override-page pt"></div>').appendTo(document.body); //for sites that use domain forwarding
}


//


function addMainMenu(mesh, data) {

  var menu = $('<div class="pt-menu pt"></div>')

  var isMainMenu = mesh.isMe || mesh.role === 'menu'

  var html = Templates.extension.addMenu({
    isMe: isMainMenu,
    isExtension: isExtension,
    data: data
  })

  mesh.menu = menu
  $('body').append(menu)
  menu.html(html)

  menu.find('.pt-menu-hide-pt').on('mouseup touchend', closePt)
  menu.find('.pt-menu-zoom').on('mouseup touchend', zoomPt)
  menu.find('.pt-menu-item').on('mouseup touchend', openIframe)
  menu.find('.pt-return-home').on('mouseup touchend', returnHome)
  menu.on('mouseup touchend', function(e) {
    e.stopPropagation()
  })
  menu.find('div').not('.pt-menu-zoom').on('mouseup touchend', function(e) {
    triggerKeyUp()
  })
  console.log('ADDMAIN MENU')
  addMenuIcon(data)
}


function returnHome() {

  myCharacter.position.x = 2
  camera.position.x = 0
  myCharacter.faceForward()

  //simulate key down
  var keyCode = {
    'keyCode': 40
  }
  onKeyUp(keyCode)

  putCharacter(hideNameTags)

}
//

var mainMenuIconWidth

function addMenuIcon(data) {

  var icon = $('<span>&nbsp; &nbsp;</span>') //&#9776;
  var badge = $('<span class="pt-notification-counter"></span>')
  var container = $('<div class="pt-menu-icon pt"></div>')
  var requests = data.friendRequests || []
  var num_requests = requests.length

  $(container).on('click touchstart', function(e) {
    e.stopPropagation()
  })

  $(container).on('mouseenter', function() {
    //showMenu()
    //hideNameTags()
  })

  var notifications = num_requests
  badge.text(notifications)

  container.append(icon)
  container.append(badge)
  myCharacter.nameTag.append(container)

  $('.pt-menu-icon').css('zoom', zoomFactor)

  mainMenuIconWidth = container.width()

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


function getFriendInfo(idOrName, callBack) {

  $.ajax({
    method: 'GET',
    url: 'https://passti.me/api/users/' + idOrName,
    success: function(data) {
      console.log(data)

      if (data.status === 'success') {

        var user = data.data
        if (callBack) callBack(user)

        return user
      }
    },
    error: function(err) {
      console.log(err)
    }
  })
}


//

//pull info from server only if there is a callback, dont want to hit server everytime controls are let go
function getLiveFriends(callBack) {

  if (callBack) {

    $.ajax({
      method: 'GET',
      url: 'https://passti.me/api/users/' + myCharacter.data._id + '/friends/live',
      success: function(data) {
        console.log(data)

        var friends = data.data
        var liveFriends = {}

        //map live friends to an object based on _id
        friends.forEach(function(friend) {
          var user = friend.user
          liveFriends[user._id] = user._id
        })

        console.log('getLiveFriends', liveFriends)

        if (callBack) return callBack(liveFriends)

        return liveFriends
      },
      error: function(err) {
        console.log(err)
      },
    })
  } else {

    var liveFriends = {}

    myCharacter.data.friends.forEach(function(friend) {

      var friend = friend.user
      if (friend.isLive) liveFriends[friend._id] = friend._id
    })
    return liveFriends

  }
}


//


function getRemoteLiveFriends(callBack) {

  var liveFriends = {}

  updateCharacter('getRemote', null, function(character) {

    console.log('getRemoteLiveFriends', character)

    character.friends.forEach(function(friend) {
      var friend = friend.user
      if (friend.isLive) liveFriends[friend._id] = friend._id
    })

    console.log('liveFriends', liveFriends, 'character', character)

    if (callBack) callBack(liveFriends)
  })
}


//


function refreshMainMenu() {

  updateCharacter('getRemote', null, function(character) {
    removeMainMenu()
    addMainMenu(myCharacter, character)
  })
}



//


function addLiveCharacters() {

  var name = myCharacter.data.name

  $.ajax({
    method: 'GET',
    url: 'https://passti.me/api/users/' + name + '/friends/live',
    success: function(data) {
      console.log(data)

      var friends = data.data

      friends.forEach(function(friend) {
        var user = friend.user
        createCharacter(user)
      })

      console.log('addLiveCharacters', friends)

    },
    error: function(err) {
      console.log(err)
    },
  })

}


//


function removeLiveCharacters() {

  for (var character in characters) {
    removeCharacter(characters[character].data)
  }

}


//

var menu_y_offset = 3.5


function openIframe(e, _mesh) {

  e.stopPropagation()

  var target = e.currentTarget
  var role = _mesh.role || $(target).find('div').data('role') || $(target).find('a').data('role') //menu || notification
  var id = _mesh.character.data._id || $(target).closest('ul').data('id') || $(target).find('a').data('id') //menu || notification
  window.roomToOpen = _mesh.character.data.room._id || $(target).find('div').data('room') || $(target).find('a').data('room')

  var src = 'https://passti.me/' + role
  var iframe = characters[id].iframe
  var previousSrc = $(iframe).attr('src')

  iframe.data('role', role)

  if (previousSrc !== src) iframe.attr('src', src)

  positionIframe(iframe)
  showIframe(iframe)

}

function updateIframePositions() {

  for (var character in characters) {

    if (!characters[character].hasIframe) return

    var isShown = characters[character].iframe.isShown
    if (isShown) positionIframe(characters[character].iframe)

  }

}

function positionIframe(iframe) {

  var _mesh = iframe.character
  var pos = worldToScreen(_mesh.position)
  var x = pos.x

  var data = new THREE.Vector3(0, _mesh.height, 0)
  var pos = worldToScreen(data)
  var y = Math.abs(pos.y)

  var halfWidth = iframe.width() / 2
  iframe.css('left', x - halfWidth)
  iframe.css('bottom', y * menu_y_offset)
}



var iframe_minimize_height = '22px'
var iframe_maximize_height = '375px'

function minimizeIframe(e, iframe, isMaximize) {

  if (!iframe) {
    var target = e.currentTarget
    var id = $(target).data('id')
    var userId = $(target).data('user')
    var iframe = characters[userId].iframe
  }

  if (!iframe.isMinimized && !isMaximize) {

    iframe.get(0).style.setProperty("height", iframe_minimize_height, "important") //override important style for height
    iframe.get(0).style.setProperty("width", "130px", "important") //override important style for height

    iframe.isMinimized = true
    $(iframe).contents().find('.pt-room-body').hide()
      // $(iframe).contents().find('body').removeClass('hover-show-header')
    $(iframe).contents().find('.pt-minimize-room').data('is-minimized', true)
    $(iframe).contents().find('.pt-minimize-room').find('img').attr('src', 'icons/core/plus-white.svg')

  } else if (iframe.isMinimized || isMaximize) {

    iframe.get(0).style.setProperty("height", iframe_maximize_height, "important") //override important style for height
    iframe.get(0).style.setProperty("width", "275px", "important") //override important style for height

    iframe.isMinimized = false

    $(iframe).contents().find('.pt-room-body').show()
      //$(iframe).contents().find('body').addClass('hover-show-header')
    $(iframe).contents().find('.pt-minimize-room').data('is-minimized', false)
    $(iframe).contents().find('.pt-minimize-room').find('img').attr('src', 'icons/core/minus-white.svg')

  }


}


function showIframe(iframe) {

  if (iframe) {
    iframe.show()
    iframe.isShown = true
  } else {

    $('.pt-iframe').show()
    $('.pt-iframe').each(function(index, iframe) {
      iframe.isShown = true
    })

  }
}



function isYoutubeOrSoundcloud(noisyTab) {

  var url = noisyTab.url

  if (url.indexOf('youtu') > -1) return 'youtube'
  else if (url.indexOf('soundcloud') > -1) return 'soundcloud'

  return false

};

function getYoutubeTimestamp() {

  var videoElt = document.getElementsByClassName("html5-main-video")[0]
  var timestamp = videoElt.currentTime; //in seconds

  return timestamp
}

function getSoundcloudTimestamp() {

  var timelineElt = $('.playbackTimeline__progressWrapper')
  var timestamp = timelineElt.attr('aria-valuenow') / 1000 //in seconds

  return timestamp

}



// var livePost = {}
// var hasContentPosted = false
// var hasContentEnded = false


// function endLivePost(){

//   console.log('endLivePost')

//     var data = {
//       event:'endPost',
//       post: livePost,
//       type:'socket'
//     }

//     livePost = {}
//     hasContentEnded = true

// }

// function startLivePost(){

//   console.log('startLivePost')

//     var data = {
//       event:'post',
//       post: livePost,
//       type:'socket'
//     }

//     emitMsg(data)
//     hasContentPosted = true

// }

// function onTabActivity(data){

//   console.log('onTabActivity', data)

//   var noisyTabs = data.noisyTabs

//   var service = false

//   if (noisyTabs.length > 0)  service = isYoutubeOrSoundcloud(noisyTabs[0])
//   if (!service) return

//   if (noisyTabs.length < 1 && !hasContentEnded)  endLivePost()

//   else if (noisyTabs.length > 0 && hasContentPosted && livePost.url !== noisyTabs[0].url){

//     endLivePost()
//     //then

//     livePost = {
//       tabId : noisyTabs[0].id,
//       url: noisyTabs[0].url,
//       title: noisyTabs[0].title,
//       type: service
//     }

//     startLivePost(noisyTabs[0])

//   }


//    else if (noisyTabs.length > 0 && !hasContentPosted){

//     livePost = {
//       tabId : noisyTabs[0].id,
//       url: noisyTabs[0].url,
//       title: noisyTabs[0].title,
//       type: service
//     }

//     startLivePost()

//   }

// }

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

var isMouseDown = false

function onMouseDown() {
  isMouseDown = true
}


//


function onMouseUp(e) {
  //hideMenu()

  $('.pt-iframe').hide() //remove this later
  isMouseDown = false
  hideMenu3D()

  // if (isMobile) {
    isMouseHovering = (mouseY > window.innerHeight - canvasHeight)
    detectMeshHover()
  // }

  console.log(hoveredMesh)
  if (hoveredMesh && hoveredMesh.hasMenu3D) showMenu3D(hoveredMesh)
  else if (hoveredMesh && hoveredMesh.isIcon) {
    openIframe(e, hoveredMesh)
  }

  //else if (hoveredMesh && !isMenuDisplayed) showMenu(hoveredMesh)

}


//

function closeIframe(e) {

  var target = e.currentTarget
  var id = $(target).data('id')
  var userId = $(target).data('user')

  var iframe = characters[userId].iframe

  $(iframe).contents().find('.pt-room-body').show()
  minimizeIframe(false, iframe, true)
  resetIframe(iframe)
  iframe.isShown = false
  iframe.hide();

}

function resetIframe(iframe) {

  if (iframe) iframe.attr('src', '')
  else $('.pt-iframe').attr('src', '')
}

//
var isMenuDisplayed = false
var main_menu_x_off = 8
var main_menu_y_off = 5


function showMenu3D(_mesh) {
  hideMenu3D()
  _mesh.zoomInMenu()
}

function hideMenu3D() {

  for (var character in characters) {

    if (!characters[character].hasMenu3D) return

    characters[character].zoomOutMenu()

  }

}


function showMenu(_mesh) {

  hideMenu()

  if (!_mesh) { //if mesh is passed create menu at mesh pos, else create menu at left side of screen menu icon

    _mesh = mesh
    var x = mainMenuIconWidth + main_menu_x_off

  } else {
    var pos = worldToScreen(_mesh.position)
    var x = pos.x

  }


  var data = new THREE.Vector3(0, _mesh.height, 0)
  var pos = worldToScreen(data)
  var y = Math.abs(pos.y)


  var menu = _mesh.menu

  var rightWall = window.innerWidth - menu.width()
  if (x > rightWall) x = rightWall

  menu.css('left', x)
  menu.css('bottom', y * menu_y_offset)
  menu.show();

  $('.pt-menu-icon').addClass('pt-menu-open')

  isMenuDisplayed = true
}


//


function hideMenu() {
  $('.pt-menu').hide();
  $('.pt-menu-icon').removeClass('pt-menu-open')
  isMenuDisplayed = false
}


//


function closePt() {
  $('.pt').remove()
  removeDomListeners()
}

//


//


function changeSubmitButton(disable, replaceText, id, elt) {

  if (!id && !elt) var btn = $("input[type='submit']")
  else if (id) var btn = $(id)
  else if (elt) var btn = $(elt)

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