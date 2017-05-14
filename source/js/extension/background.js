var socket = io('http://localhost:5050', {
  path: '/socket'
})


function emitMsgToClient(data) {

  chrome.tabs.query({}, function(tabs) {

    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, data);
    })

  });
}

function emitMsgToServer(event, data) {

  console.log('emit', event, data)
  socket.emit(event, data)
  
}

function initSockets() {

  var events = ['chat', 'post', 'action', 'disconnect', 'socketId']

  events.forEach(function(event) { //broadcast most events

    socket.on(event, function(data) {

      if (data === 'transport close') {
        var data = {
          event: event
        }
      }
      
      data.type = 'socket'


      emitMsgToClient(data)
    })
  })

}

function onInstall(data) {
  console.log(data)

  if (data.reason == "install") { //new install

    var url = 'https://passti.me'

    chrome.tabs.update({
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

  var url = 'https://passti.me'

  chrome.tabs.update({
    url: url
  });

}



// var isFirstJoin = true

function onJoin(data) {

  // if (isFirstJoin) {

    // console.log('isFirstJoin', isFirstJoin, data)
    // isFirstJoin = false
    emitMsgToServer('join', data)
  // }

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

initSockets()