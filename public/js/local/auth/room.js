$(document).ready(function() {

  var messages = []

  function createInterface(room) {


    var html = Templates.extension.addRoom(room)

    var container = $('#pt-room-container')
    container.append(html)
    $('body').addClass('hover-show-header')

    //event listeners
    $('.pt-close-room').click(parent.closeIframe)
    $('.pt-minimize-room').click(parent.minimizeIframe)
    $('#pt-room-form').on('submit', onFormSubmit)
    $('#pt-room-input').focus()

    window.messageList = $('ul')

  }

  function initChat() {

    getRoomData.then(function(room) {

      console.log(room)
      createInterface(room)
      addCachedMsgsToDom(room.messages)

    })

  }

  var getRoomData = new Promise(function(resolve, reject) {

    $.ajax({
      method: 'GET',
      url: '/api/rooms',
      success: function(data) {
        console.log(data)

        if (data.status === 'success') {

          var room = data.data[0]

          resolve(room);

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

    var message = $('#pt-room-input').val();
    if (!message) return

    var user = myCharacter.data

    var data = {
      content: message,
      outgoing: true,
      user: user
    }

    createMessage(data)
      //postMessage()

    $('#pt-room-input').val('');

  }

  function createMessage(data) {

    console.log('createMessage', data)

    var message = data.content
    var outgoing = data.outgoing
    var id = data.user._id
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
    $('#pt-room-input').focus()


  }

  function addCachedMsgsToDom(messages) {

    messages.forEach(function(data) {
      createMessage(data)
    })

  }


  function scrollChatToBottom() {
    var container = $('#pt-messages-container')[0]
    container.scrollTop = container.scrollHeight; //scroll to bottom of room
  }


  function getUTCDate() {
    return moment.utc().format()
  }



  initChat()


})