var socket = io('http://localhost:5050', {
  'path': '/socket',
  'forceNew': true
})

var myCharacter = {}

chrome.storage.sync.get('pt-user', function(data) {

  myCharacter = data['pt-user']

})


//



function isYoutubeOrSoundcloud(noisyTab) {

  var url = noisyTab.url

  if (url.indexOf('youtu') > -1) return 'youtube'
  else if (url.indexOf('soundcloud') > -1) return 'soundcloud'

  return false

};


//send an update of any tabs that are playing anything

setInterval(function() {

  chrome.tabs.query({
    audible: true
  }, function(tabs) {

    var noisyTabs = tabs;

    var serviceType = null

    if (noisyTabs.length > 0) serviceType = isYoutubeOrSoundcloud(noisyTabs[0])

    if (noisyTabs.length < 1 && !hasContentEnded) endLivePost()

    else if (noisyTabs.length > 0 && serviceType && hasContentPosted && livePost.url !== noisyTabs[0].url) {

      endLivePost()
        //then

      livePost = {
        tabId: noisyTabs[0].id,
        url: noisyTabs[0].url,
        title: noisyTabs[0].title,
        type: serviceType
      }

      startLivePost()

    } else if (noisyTabs.length > 0 && serviceType && !hasContentPosted) {

      livePost = {
        tabId: noisyTabs[0].id,
        url: noisyTabs[0].url,
        title: noisyTabs[0].title,
        type: serviceType
      }

      startLivePost()

    }



    chrome.tabs.query({

      currentWindow: true,
      active: true

    }, function(tabs) {

      var activeTab = tabs[0];

      if (!activeTab) return

      chrome.tabs.sendMessage(activeTab.id, {
        'type': 'tabActivity',
        'noisyTabs': noisyTabs
      });

    });
  })

}, 5000);



var livePost = {}
var hasContentPosted = false
var hasContentEnded = false


function endLivePost() {

  var data = {
    event: 'endPost',
    post: livePost,
    _id: myCharacter._id,
    type: 'socket'
  }


  emitMsgToServer('endPost',data)
  hasContentEnded = true
  hasContentPosted = false

  console.log('endLivePost', data)

  livePost = {}

}

function startLivePost() {

  var data = {
    event: 'post',
    post: livePost,
    _id: myCharacter._id,
    type: 'socket'
  }

  emitMsgToServer('post',data)
  hasContentEnded = false
  hasContentPosted = true

  console.log('startLivePost', data)

}

function onTabActivity(data) {

  console.log('onTabActivity', data)

  var noisyTabs = data.noisyTabs

  var service = false

  if (noisyTabs.length > 0) service = isYoutubeOrSoundcloud(noisyTabs[0])
  if (!service) return

  if (noisyTabs.length < 1 && !hasContentEnded) endLivePost()

  else if (noisyTabs.length > 0 && hasContentPosted && livePost.url !== noisyTabs[0].url) {

    endLivePost()
      //then

    livePost = {
      tabId: noisyTabs[0].id,
      url: noisyTabs[0].url,
      title: noisyTabs[0].title,
      type: service
    }

    startLivePost()

  } else if (noisyTabs.length > 0 && !hasContentPosted) {

    livePost = {
      tabId: noisyTabs[0].id,
      url: noisyTabs[0].url,
      title: noisyTabs[0].title,
      type: service
    }

    startLivePost()

  }

}


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
      emitMsgToClient(data)
    })
  })
}


//


function onInstall(data) {
  console.log(data)

  if (data.reason == "install") {

    var url = 'https://passti.me'

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
        title: "The menu",
        message: "is in the bottom left corner."
      }, {
        title: "Sign off",
        message: "by walking to the left wall"
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
  console.log('received from content', data)

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
      chrome.tabs.sendMessage(tab.id, data, function(response) {

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