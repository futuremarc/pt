function emitMsgToBg(data) {
  chrome.runtime.sendMessage(data);
}


//


function onSocket(data) {
  console.log(data)
  var event = data.event
  socketEvents[event](data)
}


//


function emitJoinMsg() {

  putCharacter(function() {

    var info = getCharacterInfo()

    var data = {
      'type': 'socket',
      event: 'join',
      _id: info._id,
      position: info.pos,
      rotation: info.rot,
      liveFriends: info.liveFriends
    }

    console.log('emitJoinMsg', data)
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


function createMenu() {

  var src = chrome.extension.getURL('menu.html');
  var iFrame = $('<iframe frameborder="0" class="pt-iframe" src=" ' + src + '"></iframe>');
  $('body').append(iFrame);
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
    var pos = worldToScreen(user.position)

    user.nameTag.css('left', pos.x - 15) //TO DO: calculate centering nameTag
  }

  isNameDisplayed = true
}


//


function hideNameTags() {

  $('.pt-name-tag').hide()
  isNameDisplayed = false
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


function hideCanvas() {
  $('#pt-canvas').hide()
}


//


function showCanvas() {
  $('#pt-canvas').show()
}