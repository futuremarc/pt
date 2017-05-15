var socket = io('http://localhost:5050', {
  'path': '/socket',
  'forceNew': true
})


function emitMsgToClient(data) {

  chrome.tabs.query({}, function(tabs) {

    tabs.forEach(function(tab) {
      chrome.tabs.sendMessage(tab.id, data);
    })

  });
}

function emitMsgToServer(event, data) {

  socket.emit(event, data)

}

function initSockets() {

  var events = ['chat', 'post', 'action', 'disconnect', 'join', 'connect', 'reconnect', 'leave']

  events.forEach(function(event) {

    socket.on(event, function(data) {

      var data = data || {}

      if (data === 'transport close' || event === 'reconnect') {
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

function onInstall(data) {
  console.log(data)

  if (data.reason == "install") {

    var url = 'https://passti.me/signup'

    chrome.tabs.update({
      url: url
    });

  } else if (data.reason == "update") {}

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


function onJoin(data) {
  emitMsgToServer('join', data)
}


var options = {
  type: "list",
  title: 'Welcome!',
  message: 'Welcome!',
  items: [{
    title: " ",
    message: " "
  },
  {
    title: "MOVE AROUND",
    message: "with the arrow keys."
  },{
    title: "SIGN OFF",
    message: "by walking out left."
  }],
  iconUrl: "public/img/brand/favicon-128.png",
  requireInteraction: true,
}

chrome.notifications.create('', options);



function onContentMessage(data, sender, sendResponse) {

  var isSocketMessage = data.event

  if (isSocketMessage) {

    var event = data.event
    data.type = 'socket'

    console.log(data)

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
chrome.runtime.onMessage.addListener(onContentMessage);

initSockets()