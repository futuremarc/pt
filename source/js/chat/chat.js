$(document).ready(function() {

  var socket = io('http://localhost:5050', {
  'path': '/socket',
   'forceNew': true
  })

  var messages = [], timer, messageList = $('ul')

  function initChat() {

    getStreamData.then(function(stream) {

      messages = getMessages(stream)
      initSockets()
      timer = performance.now()

    })

  }

  var getStreamData = new Promise(function(resolve, reject) {

    $.ajax({
      method: 'GET',
      url: '/api/streams/' + streamId,
      success: function(data) {
        console.log(data)

        if (data.status === 'success') {

          var stream = data.data

          sceneId = stream.scenes[0]._id
          analyticId = stream.scenes[0].analytics._id
          logo = stream.channel.logo

          resolve(stream);

        }
      },
      error: function(err) {
        console.log(err)
        reject(err);
      }
    })

  });


  function onFormSubmit(e) {

    e.preventDefault();

    var message = $('#pt-chat-input').val();
    if (!message) return

    socket.emit('chatMessage', data);

    createMessage(data)

    $('#pt-chat-input').val('');

  }

  function createMessage(data) {

    var message = data.message
    var outgoing = data.outgoing
    var id = data.user.id
    var name = data.user.name

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


    div.text(message);
    nick.text(name);

    messageList.append(li)
    scrollChatToBottom()
    $('#chat-input').focus()


  }

  function addCachedMsgsToDom(messages) {

    messages.forEach(function(msg) {

      createMessage(data)

    })


  }


  function getMessages(stream) {

    var streamMessages = []

    //add initialScene (scene[0]) messages to end of list to appear first in chat

    var initialScene = stream.scenes[0]
    var scenesLength = stream.scenes.length
    var restOfScenes = stream.scenes.splice(1, scenesLength)

    restOfScenes.forEach(function(scene) {

      var sceneMessages = scene.analytics.messages
      addCachedMsgsToDom(sceneMessages)
      streamMessages.push(sceneMessages)

    })

    var sceneMessages = initialScene.analytics.messages
    addCachedMsgsToDom(sceneMessages)
    streamMessages.push(sceneMessages)

    var arrayLen = streamMessages.length
    var maxMsgs = 100

    return streamMessages.splice(arrayLen - maxMsgs, maxMsgs)
  }



  function scrollChatToBottom() {
    var container = $('#messages-container')[0]
    container.scrollTop = container.scrollHeight; //scroll to bottom of chat
  }


  function getUTCDate() {
    return moment.utc().format()
  }


  $('#msgform').on('submit', onFormSubmit)
  initChat()


})