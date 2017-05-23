var socket = io('http://localhost:5050', {
  'path': '/socket',
  'forceNew': true
})

var myCharacter = {}


//


function initSockets() {

  var events = ['chat', 'post', 'action', 'join', 'leave', 'connect', 'reconnect', 'disconnect']

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
      emitMsgToClient(data)
    })
  })
}


//


function onInstall(data) {
  console.log(data)

  if (data.reason == "install") {

    var url = 'https://passti.me/signup'

    chrome.tabs.update({
      url: url
    });


    var options = {
      type: "list",
      title: 'Welcome!',
      message: 'Welcome!',
      items: [{
        title: "Move",
        message: "using the arrow keys."
      }, {
        title: "Sign off",
        message: "by walking offscreen to the left."
      }, {
        title: "Hover over characters",
        message: "for options."
      }],
      iconUrl: "public/img/brand/favicon-128.png",
      requireInteraction: true,
    }

    chrome.notifications.create('', options);

  } else if (data.reason == "update") {}
}


//


function idleStateChange(data) {
  console.log(data);

  chrome.tabs.query({}, function(tabs) {

    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, {
        data: data,
        type: 'idleState'
      });
    })
  });
}


//


function onBrowserAction(activeTab) {

  var url = 'https://passti.me'

  chrome.tabs.update({
    url: url
  });
}


//


function onJoin(data) {
  myCharacter.data = data
  emitMsgToServer('join', data)
}


//


function onContentMessage(data, sender, sendResponse) {
  console.log('received content', data)

  if (data.type === 'socket') {

    var event = data.event

    switch (event) {

      case 'join':
        onJoin(data)
        break;

      default:
        emitMsgToServer(event, data)
    }
  }
}


//


function emitMsgToClient(data, sendResponse) {

  chrome.tabs.query({}, function(tabs) {

    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, data, function(response){
        console.log('background send to iframe', response)
        if (sendResponse && response) sendResponse(response)
      });
    })
  });
}


//


function emitMsgToServer(event, data) {
  socket.emit(event, data)
}


//


chrome.windows.onRemoved.addListener(function(windowid) {

  var data = myCharacter.data
  emitMsgToServer('leave', data)
})


//


function onExternalMessage(data, sender, sendResponse) {
  console.log('recieved external', data, 'sender', sender)
  emitMsgToClient(data, sendResponse)
  return true
 
}

chrome.runtime.onMessageExternal.addListener(onExternalMessage);


chrome.idle.onStateChanged.addListener(idleStateChange);
chrome.runtime.onInstalled.addListener(onInstall);
chrome.browserAction.onClicked.addListener(onBrowserAction);
chrome.runtime.onMessage.addListener(onContentMessage);
initSockets()