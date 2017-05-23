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


function emitJoinMsg() {

  putCharacter(function() {

    var info = getCharacterInfo()

    var data = {
      'type' : 'socket',
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
      'type' : 'socket',
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
  $('<div id="pt-container" class="pt-override-page"></div>').appendTo('body');
}


//


function addMenuIcon() {
  var icon = $('<span class="glyphicon glyphicon-menu-hamburger"></span>')
  var iconContainer = $('<div class="pt-menu-icon"></div>')

  $(iconContainer).click(function(e) {
    e.stopPropagation()
  })
  $(iconContainer).on('mouseenter', showMenu)

  iconContainer.append(icon)
  $('body').append(iconContainer)

}


//


function openIframe(e) {

  e.stopPropagation()
  var target = e.currentTarget
  var isMe = $(target).closest('ul').data('is-me')
  var purpose = $(target).data('purpose')
  var iframe = document.createElement('iframe')
  var src = 'http://localhost:8080/' + purpose


  $('.pt-iframe').remove()
  $(iframe).attr('frameborder', 0)
  $(iframe).attr('src', src)
  $(iframe).data('purpose', purpose)
  $(iframe).addClass('pt-iframe')
  $(iframe).click(function(e) {
    e.stopPropagation()
  })

  $('body').append(iframe)

  // iframe.onload = function() {
  //   console.log('iframe loaded', window.location, window.location.origin)

  //   $(iframe.contentWindow.document).on('keyup', function(e) {

  //     if (e.keyCode === 13) return

  //     var errorMessage = $(iframe).contents().find('.error-message h3')
  //     var name = $(iframe).contents().find('input').val()
  //     var timeout = null

  //     if (!name) return

  //     clearTimeout(timeout)
  //     errorMessage.html('searching...')

  //     var self = this

  //     $.ajax({
  //       method: 'GET',
  //       url: 'http://localhost:8080/api/user/' + name,
  //       success: function(data) {
  //         console.log(data)
  //         clearTimeout(timeout)

  //         if (data.status === 'success') {

  //           if (data.data) errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
  //           $(self).data('id', data.data._id)

  //           //iframe.contentWindow.changeSubmitButton(false)
  //           $('iframe')[0].contentWindow.changeSubmitButton(false)

  //         } else if (data.status === 'not found') {
  //           changeSubmitButton(true)
  //             // timeout = setTimeout(function() {
  //             //   errorMessage.html('&nbsp;')
  //             // }, 2000)
  //         } else if (data.status === 'error') {
  //           errorMessage.html(data.message)
  //           iframe.contentWindow.changeSubmitButton(true)
  //         }
  //       },
  //       error: function(err) {
  //         console.log(err)
  //       }
  //     })
  //   })

  // }

}

function onExternalMsg(data, sender, sendResponse){
  data.update = true
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
  $('.pt-iframe').remove();
  hideMenu()
}


//


function showMenu(mesh) {

  hideMenu()
  var pos = worldToScreen(mesh.position)
  var menu = mesh.menu

  menu.css('left', pos.x)
  menu.show();
}


//


function hideMenu() {
  $('.pt-menu').hide();
}


//


function togglePt() {
  $('.pt-menu').remove()
  $('#pt-container').remove()
  $('.pt-menu-icon').remove()
  $('.pt-iframe').remove()
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