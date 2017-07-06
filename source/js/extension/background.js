var socket = io('http://localhost:5050', {
  'path': '/socket',
  'forceNew': true
})


SC.initialize({
  client_id: 'bf0076a8fe054ea15003fb6fe36244cc'
});


var myCharacter = {}


//what happens when installed but no account? get a new value after user registers... check ifRegistered() for things like liveposts
chrome.storage.sync.get('pt-user', function(data) {

  myCharacter.data = data['pt-user']
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
  }, function(noisyTabs) {

    var noisyTab = noisyTabs[0]
    var service = null

    if (noisyTabs.length > 0) service = isYoutubeOrSoundcloud(noisyTab) //only test 1st noisy tab for now

    if (service){
      var tabUrl = noisyTab.url
      var title = noisyTab.title
    }

    if (noisyTabs.length < 1 && !hasContentEnded && livePost) endLivePost()

    else if (noisyTabs.length > 0 && service && hasContentPosted && livePost.title !== noisyTab.title) {

      endLivePost(function() {

        getLivePostInfo(title, service, tabUrl, function(data) {

          var url = data.url
          var tabId = noisyTab.id
          var contentId = data.id.toString()

          livePost = {
            tabId: tabId,
            url: url,
            contentId: contentId,
            title: title,
            type: service
          }
          startLivePost()

        })


      })

    } else if (noisyTabs.length > 0 && service && !hasContentPosted) {

      getLivePostInfo(title, service, tabUrl, function(data) {

        var url = data.url
        var tabId = noisyTab.id
        var contentId = data.id.toString()

        livePost = {
          tabId: tabId,
          url: url,
          contentId: contentId,
          title: title,
          type: service
        }

        startLivePost()
      })
    }
  })

}, 5000);



var livePost = undefined
var hasContentPosted = false
var hasContentEnded = false


function endLivePost(callBack) {

  var id = isRegistered()
  if (!id) return

  getLiveFriends(function(liveFriends) {

    var room = myCharacter.data.room._id

    $.ajax({
      method: 'PUT',
      url: 'http://localhost:8080/api/posts/room/' + room + '/end',
      success: function(data) {
        console.log(data)

        data = {
          event: 'endPost',
          liveFriends: liveFriends,
          post: livePost,
          room: room,
          _id: id,
          type: 'socket'
        }

        emitMsgToServer(data)
        hasContentEnded = true
        hasContentPosted = false
        livePost = undefined

        console.log('endLivePost', data)

        return callBack()
      },
      error: function(err) {
        console.log(err)
      },
    })
  })
}



function isRegistered() {
  if (!myCharacter) return false
  if (!myCharacter.data) return false
  if (!myCharacter.data._id) return false
  return myCharacter.data._id
}



function startLivePost() {

  var id = isRegistered()
  if (!id) return

  getLiveFriends(function(liveFriends) {

    var room = myCharacter.data.room._id

    var data = {
      event: 'post',
      post: livePost,
      liveFriends: liveFriends,
      room: room,
      _id: id,
      type: 'socket'
    }

    emitMsgToServer(data)
    emitMsgToClient(data)
    hasContentEnded = false
    hasContentPosted = true

    console.log('startLivePost', data)

  })

}

function getLiveFriends(callBack) {

  var id = myCharacter.data._id

  if (callBack) {

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/users/' + id + '/friends/live',
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


function getLivePostInfo(title, service, tabUrl, callBack) {
  if (service === 'soundcloud') getSoundcloudInfo(title, callBack)
  else getYoutubeInfo(title, tabUrl, callBack)
}

function getYoutubeInfo(title, tabUrl, callBack){
  console.log('getYoutubeInfo', tabUrl)

  var splitURL = tabUrl.split(/v=/g);

  if (splitURL.length > 1) {

    if (splitURL[1].length > 11) var contentId = splitURL[1].substring(0, 11);
    else var contentId = splitURL[1];

    var url = 'https://www.youtube.com/embed/' + contentId;

    var data = {
      id: contentId,
      title: title,
      url: url
    }
    return callBack(data)

  } else {
    return //callBack(false)
  }

}

function getSoundcloudInfo(title, callBack) {

  SC.get('/tracks', {
    q: title
  }).then(function(tracks) {

    if (tracks.length > 0) {

      var id = tracks[0].id
      var title = tracks[0].title
      var url = tracks[0].uri

      var data = {
        id: id,
        title: title,
        url: url
      }
      
      return callBack(data)
    } else {
      return //callBack(false)
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
  emitMsgToServer(data)
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
        emitMsgToServer(data)
    }
  } else if (data.type === 'update') {
    myCharacter.data = data.user
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


function emitMsgToServer(data) {

  var event = data.event
  socket.emit(event, data)
}


//


chrome.windows.onRemoved.addListener(function(windowid) {

  var data = myCharacter.data
  emitMsgToServer(data)
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