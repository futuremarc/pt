$(document).ready(function() {

  var messages = [],
    messageList = $('ul')

  function checkAddUsers() {
    return window.myCharacter.data
  }

  function isMe() {
    return (window.myCharacter.data.name === window.friend)
  }

  function addUsers() {

    window.friend = window.frameElement.getAttribute('data-name');
    if (isMe()) return

    var html = $('#pt-name-tag').html()
    $('#pt-name-tag').html(friend + ', ' + html)
  }


  function initChat() { //wait for data from main.js ... TODO: please use events instead
    if (checkAddUsers()) addUsers()
    else setTimeout(initChat, 100)

  }

  function onFormSubmit(e) {

    e.preventDefault();

    var message = $('#pt-chat-input').val();
    if (!message) return

    var user = myCharacter.data

    var data = {
      message: message,
      outgoing: true,
      user: user
    }

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
    $('#pt-chat-input').focus()


  }



  function scrollChatToBottom() {
    var container = $('#pt-messages-container')[0]
    container.scrollTop = container.scrollHeight; //scroll to bottom of chat
  }


  function getUTCDate() {
    return moment.utc().format()
  }


  $('#pt-chat-form').on('submit', onFormSubmit)
  initChat()


})