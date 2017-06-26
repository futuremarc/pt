var socket = io('http://localhost:5050', {
  'path': '/socket',
  'forceNew': true
})


SC.initialize({
  client_id: 'bf0076a8fe054ea15003fb6fe36244cc'
});


var myCharacter = {}

chrome.storage.sync.get('pt-user', function(data) {

  myCharacter = data['pt-user']
  console.log('myCharacter', myCharacter)

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

    var service = null

    if (noisyTabs.length > 0) service = isYoutubeOrSoundcloud(noisyTabs[0])

    var title = noisyTabs[0].title

    if (noisyTabs.length < 1 && !hasContentEnded) endLivePost()

    else if (noisyTabs.length > 0 && service && hasContentPosted && livePost.title !== noisyTabs[0].title) {

      endLivePost()
        //then

      getLivePostInfo(title, service, function(data) {

        livePost = {
          tabId: noisyTabs[0].id,
          url: data.url,
          contentId: data.id.toString(),
          title: title,
          type: service
        }

        startLivePost()

      })

    } else if (noisyTabs.length > 0 && service && !hasContentPosted) {

       getLivePostInfo(title, service, function(data) {

        livePost = {
          tabId: noisyTabs[0].id,
          url: data.url,
          contentId: data.id.toString(),
          title: title,
          type: service
        }

        startLivePost()
      })
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

  getLiveFriends(function(liveFriends) {

    var data = {
      event: 'endPost',
      liveFriends: liveFriends,
      post: livePost,
      _id: myCharacter._id,
      type: 'socket'
    }

    emitMsgToServer('endPost', data)
    hasContentEnded = true
    hasContentPosted = false

    console.log('endLivePost', data)

    livePost = {}

  })



}

function startLivePost() {

  getLiveFriends(function(liveFriends) {

    var data = {
      event: 'post',
      post: livePost,
      liveFriends: liveFriends,
      room: myCharacter.room,
      _id: myCharacter._id,
      type: 'socket'
    }

    emitMsgToServer('post', data)
    hasContentEnded = false
    hasContentPosted = true

    console.log('startLivePost', data)

  })

}

function getLiveFriends(cB) {

  console.log('getLiveFriends', myCharacter._id)

  if (cB) {

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/users/' + myCharacter._id + '/friends/live',
      success: function(data) {
        console.log(data)

        var friends = data.data
        var liveFriends = {}

        //map live friends to an object based on _id

        if (!friends) return liveFriends

        friends.forEach(function(friend) {
          var user = friend.user
          liveFriends[user._id] = user._id
        })

        console.log('getLiveFriends', liveFriends)

        if (cB) return cB(liveFriends)

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


function getLivePostInfo(title, service, cB) {
  if (service === 'soundcloud') getSoundcloudInfo(title, cB)
  else console.log('getyoutubeinfo')
}

function getSoundcloudInfo(title, cB) {

  SC.get('/tracks', {
    q: title
  }).then(function(tracks) {

    console.log('tracks', tracks)

    if (tracks.length > 0) {
      var data = {
        id: tracks[0].id,
        title: tracks[0].title,
        url: tracks[0].uri
      }
      return cB(data)
    } else {
      return cB(false)
    }
  })
}

function initSockets() {

  var events = ['chat', 'endPost', 'post', 'action', 'join', 'leave', 'connect', 'reconnect', 'disconnect', 'friend', 'request']

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
        message: "using the arrow keys or click and drag"
      }, {
        title: "The menu",
        message: "is inside the characters"
      }, {
        title: "Sign off",
        message: "by walking off the left side."
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