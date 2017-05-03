
function emitMsgToClient(data) {
  chrome.runtime.sendMessage(data);
}

function emitMsgToServer(event, data) {
  socket.emit(event, data)
}

function initSockets() {

  var events = ['chat', 'post', 'action']

  events.forEach(function(event) { //broadcast most events

    socket.on(event, function(data) {
      data.type = 'socket'
      emitMsgToClient(data)
    })
  })

}

function onInstall(data) {
  console.log(data)

  if (data.reason == "install") { //new install

    var url = 'https://passti.me'
    chrome.tabs.create({
      url: url
    });

  } else if (data.reason == "update") {} //send msg notifying of updates

}


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


function onBrowserAction(activeTab) {
  console.log(activeTab)

  var url = 'https://passti.me'


  chrome.tabs.create({
    url: url
  });

}



var isFirstJoin = true

function onJoin(data) {

  if (isFirstJoin) {

    console.log('isFirstJoin', isFirstJoin)
    isFirstJoin = false
    emitMsgToServer('join', data)
  }

}



function onMessage(data, sender, sendResponse) {
  console.log(data)

  var isSocketMessage = data.event
  if (isSocketMessage) {
    
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


chrome.idle.onStateChanged.addListener(idleStateChange);
chrome.runtime.onInstalled.addListener(onInstall);
chrome.browserAction.onClicked.addListener(onBrowserAction);
chrome.runtime.onMessage.addListener(onMessage);


var socket = io('http://localhost:5050', {
  path: '/socket'
})

initSockets()


