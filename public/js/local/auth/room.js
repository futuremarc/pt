$(document).ready(function() {

  var messages = []

  function createInterface(room) {

    var html = Templates.extension.addRoom(room)

    var container = $('#pt-room-container')
    container.append(html)
      //$('body').addClass('hover-show-header')

    //event listeners
    $('#pt-close-room').click(closeRoom)
    $('#pt-search-room').click(toggleSearchRoom)
    $('#pt-minimize-room').click(minimizeRoom)
    $('#pt-room-form').on('submit', onFormSubmit)
    $('#pt-room-input').focus()

    window.messageList = $('ul')

  }

  function toggleSearchRoom() {

    if ($('#pt-room-input').data('role') === 'chat') {
      $('#pt-room-input').attr('placeholder', 'Search...');
      $('#pt-room-input').data('role', 'search');
      window.searchMode = true;
    } else {
      $('#pt-room-input').attr('placeholder', 'Send a message...');
      $('#pt-room-input').data('role', 'chat');
      window.searchMode = false;
    }

    $('input').val('')
    $('input').focus()

  }

  function closeRoom(domEvent) {

    var data = {
      'event': 'closeIframe',
      //'domEvent': new MouseEvent(domEvent.type, domEvent),
      '_id': window.roomId,
      'type': 'window'
    }

    console.log('iframe sent', data)
    if (isIframe) window.parent.postMessage(data, '*')

  }

  function minimizeRoom(domEvent) {

    var data = {
      'event': 'minimizeIframe',
      '_id': window.roomId,
      //'domEvent': new MouseEvent(domEvent.type, domEvent),
      'type': 'window'
    }

    console.log('iframe sent', data)
    if (isIframe) window.parent.postMessage(data, '*')

  }

  window.initRoom = function(id) {

    console.log('initRoom', id)
    getRoomData(id).then(function(room) {
      console.log('got ROOM', room)
      createInterface(room)
      addCachedMessages(room.messages)
      initSockets()
      window.addEventListener('beforeunload', leaveRoom)

    })

  }


  function initSockets() {

    if (!socket) window.socket = io('http://localhost:5050', {
      'path': '/socket',
      'forceNew': true
    })

    joinRoom()

    socket.on('chat', createMessage)
    socket.on('endPost', endPost)
    socket.on('post', post)
    socket.on('disconnect', leaveRoom)
    socket.on('reconnect', joinRoom)

  }

  function endPost(data) {
    var iframe = $('#pt-content')
    iframe.attr('src', '')
  }

  function post(data) {

    var id = data.post.id
    var title = data.post.title
    var url = data.post.url
    var iframe = $('#pt-content')
    var src = "https://w.soundcloud.com/player/?url=" + url + "&amp;auto_play=false&amp;hide_related=true&amp;show_comments=false&amp;show_user=false&amp;show_reposts=false&amp;visual=true"

    iframe.data('id', id)
    iframe.data('title', title)
    iframe.attr('src', src)
  }


  function joinRoom() {

    var data = {
      'event': 'joinRoom',
      'room': window.roomId,
      'type': 'socket'
    }

    // window.parent.postMessage(data, '*')

    socket.emit('joinRoom', data)
  }

  function leaveRoom() {


    var data = {
      'event': 'leaveRoom',
      'room': window.roomId,
      'type': 'socket'
    }

    // window.parent.postMessage(data, '*')

    socket.emit('leaveRoom', data)

  }


  var getRoomData = function(_roomId) {

    return new Promise(function(resolve, reject) {

      if (isIframe) var id = _roomId;
      else if (window.roomId) var id = window.roomId
      else var id = window.userId

      $.ajax({
        method: 'GET',
        url: '/api/rooms/' + id,
        success: function(data) {
          console.log(data)

          if (data.status === 'success') {

            var room = data.data
            window.roomId = room._id

            resolve(room);

          }
        },
        error: function(err) {
          console.log(err)
          reject(err);
        }
      })

    });

  }



  function onFormSubmit(e) {

    e.preventDefault();

    var content = $('#pt-room-input').val();
    if (!content) return

    var name = window.userName || myCharacter.data.name //from pug (not iframe)|| from initAuth (iframe)
    var id = window.userId || myCharacter.data._id

    var user = {
      _id: id,
      name: name
    }

    var message = {
      content: content,
      room: window.roomId, //global
      user: user
    }

    createMessage(message)

    var data = {
      'event': 'chat',
      'message': message,
      'type': 'window'
    }

    socket.emit('chat', message)

    // window.parent.postMessage(data, '*')

    $('#pt-room-input').val('');

  }

  function createMessage(message) {

    //if not logged in make user anon
    if (!message.user) message.user = {
      name: 'anonymous',
      _id: 0
    }
    var content = message.content
    var id = message.user._id
    var name = message.user.name

    var outgoing = (id === _id) //_id is global from pug

    var outwrapper1 = $(document.createElement('div'));
    outwrapper1.addClass('out-wrapper')
    var inwrapper1 = $(document.createElement('div'))
    inwrapper1.addClass('in-wrapper')
    var outwrapper2 = $(document.createElement('div'));
    outwrapper2.addClass('out-wrapper')
    var inwrapper2 = $(document.createElement('div'))
    inwrapper2.addClass('in-wrapper')

    var div = $(document.createElement('div'));
    var nick = $(document.createElement('div'));
    var li = $(document.createElement('li'));
    nick.addClass('nick-name')

    if (outgoing) {

      li.append(outwrapper1)
      outwrapper1.append(nick)
      li.append(outwrapper2)
      outwrapper2.append(div)
      div.addClass('outgoing-msg')

    } else {

      li.append(inwrapper1)
      inwrapper1.append(nick)
      li.append(inwrapper2)
      inwrapper2.append(div)
      div.addClass('incoming-msg')

    }


    div.text(content);
    nick.text(name);
    messageList.append(li)
    scrollChatToBottom()
    $('#pt-room-input').focus()

  }

  function addCachedMessages(messages) {

    messages.forEach(function(message) {
      createMessage(message)
    })

  }


  function scrollChatToBottom() {
    var container = $('#pt-messages-container')[0]
    container.scrollTop = container.scrollHeight; //scroll to bottom of room
  }


  function getUTCDate() {
    return moment.utc().format()
  }



  // function ytInit(data) {

  //   window.tag = document.createElement('script');

  //   window.tag.src = "https://www.youtube.com/iframe_api";
  //   window.firstScriptTag = document.getElementsByTagName('script')[0];
  //   window.firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  //   window.onYouTubeIframeAPIReady = function() {

  //     console.log('onYouTubeIframeAPIReady');

  //     window.ytPlayer = new YT.Player('ytPlayer', {
  //       height: '390',
  //       width: '640',
  //       videoId: 'jMGYZ3McHTM',
  //       startSeconds: 1,
  //       origin: 'http://localhost:8080',
  //       events: {
  //         'onReady': onPlayerReady,
  //         'onStateChange': onPlayerStateChange
  //       }
  //     });
  //     //ytPlayer.setSize(windowWidth, windowHeight);

  //     ytCall()

  //   }

  //   window.onPlayerReady = function(event) {
  //     console.log('onPlayerReady');

  //   }


  //   window.onPlayerStateChange = function(event) {
  //     console.log('onPlayerStateChange')
  //   }

  // }

  // ytInit()


  $('body').on('keyup', '#pt-room-input', function() {

    if (!window.searchMode) return

    var searchTerm = $(this).val();
    if (searchTerm) searchYT(searchTerm);

  })


  function searchYT(searchTerm) {

    $.ajax({
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=7&q=' + searchTerm + '&key=AIzaSyDF0ANsCSLUYkeA6BFQABfYeBRPKc1bB54',
      success: function(data) {
        console.log(data);

        var ytResults = data.items;

        searchSC(searchTerm, function(scResults) {

          var data = {
            ytResults: ytResults,
            scResults: scResults
          }

          console.log('POPULATE', data)

          var html = Templates.extension.addSearchResults(data);
          var container = $('#pt-search-results-container');

          container.show()
          container.html(html);

          $('li').click(function() {
            console.log('new post', $(this).data('contentid'))
          })

          $('#pt-close-search-results').click(function() {
            $('#pt-search-results-container').hide()
            toggleSearchRoom()
          })
        })

      },
      error: function(err) {
        console.log(err);
      }
    })

  }


  SC.initialize({
    client_id: 'bf0076a8fe054ea15003fb6fe36244cc'
  });



  function searchSC(searchTerm, callBack) {

    SC.get('/tracks', {
      q: searchTerm,
      limit: 7
    }).then(function(tracks) {

      return callBack(tracks)

    })
  }



  if (!isIframe) initRoom()


})