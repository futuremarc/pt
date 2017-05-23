$('document').ready(function() {


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
    var errorMessage = $('.error-message')
    var name = data.name

    console.log('SUBMIT', data, action)


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

      case 'addFriend':

        onSubmitFriendRequest(data, action)

        break;
    }

  }


  function onSubmitFriendRequest(data, action) {

    var errorMessage = $(".error-message h3")
    var name = data.name;
    var userId = data._id
    var friendId = data.friendId
    var action = action

    var data = {
      userId: userId,
      friendId: friendId
    }

    $.ajax({
      method: 'POST',
      url: 'http://localhost:8080/api/user/friend/request',
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
  }


  var windowMsgEvents = {

    'settings': function(data) {

      console.log('IFRAME settings', data)

      var action = data.action
      var data = {}

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
      var data = data.data

      console.log('IFRAME friend', data)

      submitData(data, action)

    }
  }


  //

  function onWindowMsg(event) {
    console.log('IFRAME recieved', event)

    var action = event.data.action
    var data = event.data

    windowMsgEvents[action](data)
  }



  window.addEventListener("message", onWindowMsg, false);


})