$('document').ready(function() {

  var loggedIn = loggedIn || false

  if (loggedIn) {

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/user/' + name,
      success: function(data) {
        console.log(data)

        if (data.status === 'success') {

          var container = $('#friend-requests-parent')
          var reqs = data.data.friendRequests
          var html = Templates.auth.addFriendRequests(reqs)
          container.html(html)

          var container = $('#friends-list-parent')
          var friends = data.data.friends
          var html = Templates.auth.addFriendsList(friends)
          container.html(html)

        } else {
          errorMessage.html(data.message)
        }
      },
      error: function(err) {
        console.log(err)
      }
    })

  }



  //


  function submitData(data, action, cB) {

    var timeout = null
    var errorMessage = $('.error-message h3')
    var name = data.user.name
    var userId = data.user._id
    var friendId = data.friendId
    var action = action


    console.log('iframe submit', data, name, action)


    switch (action) {

      case 'settings':

        errorMessage.html('&nbsp;')

        $.ajax({
          method: 'PUT',
          url: 'http://localhost:8080/api/user/' + name,
          data: data,
          success: function(data) {
            console.log(data)
            if (data.status === 'success') {

              errorMessage.html(data.message + ' settings!')
              clearTimeout(timeout)

              timeout = setTimeout(function() {
                errorMessage.html('&nbsp;')
              }, 2000)
              if (cB) cB()

            } else {
              errorMessage.html(data.message)
            }
          },
          error: function(err) {
            console.log(err)
          }
        })

        break;

      case 'friend':

        var data = {
          userId: userId,
          friendId: friendId
        }

        $.ajax({
          method: 'POST',
          url: 'http://localhost:8080/api/user/friend/' + action,
          data: data,
          success: function(data) {
            console.log(data)
            if (data.status === 'success') {

              errorMessage.html(data.message + ' to <strong>' + data.data.name + '</strong>!')
                //updateCharacter(null, 'getRemote')

            } else {
              errorMessage.html(data.message)
            }
          },
          error: function(err) {
            console.log(err)
          }
        })

        break;
    }

  }



  //



  var windowMsgEvents = {

    'settings': function(data) {

      var action = data.action
      var subs = []

      $("#pt-auth-form input:checkbox:checked").each(function() {

        var sub = $(this).data('id')
        subs.push(sub)
      });

      data.subscriptions = subs
      submitData(data, action)

    },
    'friend': function(data) {

      var action = data.action

      submitData(data, action)

    }
  }


  //

  function onWindowMsg(data) {

    console.log('iframe random msg', data)

    if (data.data.fromExtension) {

      console.log('iframe recieved', data)

      var action = data.data.action
      var data = data.data

      windowMsgEvents[action](data)

    }

  }



  window.addEventListener("message", onWindowMsg, false);



  //


  $("body").on('submit', '#pt-auth-form', function(e) {

    e.preventDefault();

    var action = $(this).data('action')
    var data = {
      'action': action,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

    // var extensionId = 'malhbgmooogkoheilhpjnlimhmnmlpii'
    // chrome.runtime.sendMessage(extensionId, data, function(response){
    //   console.log('iframe recieved', response)
    // })

  })



  $("body").on('submit', '#pt-friend-form', function(e) {

    e.preventDefault();

    var action = $(this).data('action')
    var friendId = $(this).data('id')

    var data = {
      'friendId': friendId,
      'type': 'window',
      'action': action
    }

    // var extensionId = 'malhbgmooogkoheilhpjnlimhmnmlpii'
    // chrome.runtime.sendMessage(extensionId, data, function(response){
    //   console.log('got response', response)
    // })

    window.parent.postMessage(data, '*')

    // parent.postMessage({
    //   data: data,
    //   action: action
    // }, window.location.href)

  })



})