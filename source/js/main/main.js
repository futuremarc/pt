$('document').ready(function() {

  var submitData = {

    'friend': function(data) {

      var timeout = null
      var errorMessage = $('.error-message h3')
      var event = data.event
      var userId = data.user._id
      var friendId = data.friendId

      data = {
        userId: userId,
        friendId: friendId
      }

      $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/api/user/friend/request', // + event
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            errorMessage.html(data.message + ' to <strong>' + data.data.name + '</strong>!')

            data = {
              'event': 'update',
              'data': {
                'updateCharacter': true,
                'updateUI': true
              },
              'type': 'window',
              'user': data.data
            }

          } else {
            errorMessage.html(data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })
    },

    'request': function(data) {
      console.log('iframe recieved', data)

      var timeout = null
      var errorMessage = $('.error-message h3')
      var event = data.event
      var action = data.action
      var method = data.method
      var userId = data.user._id
      var friendId = data.friendId
      var self = this

      data = {
        userId: userId,
        friendId: friendId,
        action: action
      }

      $.ajax({
        method: method,
        url: 'http://localhost:8080/api/user/friend/request', //+ event,
        data: data,
        success: function(data) {
          console.log(data)

          var user = data.data

          var container = $('#friend-requests-parent')
          var reqs = user.friendRequests
          var html = Templates.auth.addFriendRequests(reqs)
          container.html(html)

          var container = $('#friends-list-parent')
          var friends = user.friends
          var html = Templates.auth.addFriendsList(friends)
          container.html(html)

          data = {
            'event': 'update',
            'type': 'window',
            'user': user
          }

          window.parent.postMessage(data, '*')

        },
        error: function(data) {
          console.log(data)
        }
      })

    },

    'settings': function(data) {

      var timeout = null
      var errorMessage = $('.error-message h3')
      var event = data.event
      var userId = data.user._id
      var name = data.user.name

      var subs = []
      $("#pt-auth-form input:checkbox:checked").each(function() {
        var sub = $(this).data('id')
        subs.push(sub)
      });
      data.subscriptions = subs

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

            }, 1000)
            if (cB) cB()

          } else {
            errorMessage.html(data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })
    },
    default: function(data) {

      //not in use
      var timeout = null
      var errorMessage = $('.error-message h3')
      var pos = data.user.position
      var rot = data.user.rotation
      var event = data.event
      var userId = data.user._id

      data = {
        email: email,
        password: pass,
        name: name,
        position: pos,
        rotation: rot,
        subscriptions: subs
      }

      console.log('signup/login', data)

      $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/api/' + event,
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')


            setTimeout(function() {
              location.href = '/'
            }, 100)

            return

            data = {
              'event': 'refreshPage',
              'name': name,
              'user': data.data,
              'type': 'window'
            }

            console.log('iframe sent', data)
            window.parent.postMessage(data, '*')

          } else {
            errorMessage.html(data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })


    }
  }


  //

  function onWindowMsg(data) {

    console.log('iframe random msg', data)

    if (data.data.fromExtension) {

      console.log('iframe recieved from extension', data)

      var event = data.data.event
      data = data.data

      submitData[event](data)

    }
  }


  window.addEventListener("message", onWindowMsg, false);


  $("body").on('submit', '#pt-auth-form', function(e) {
    e.preventDefault();

    var role = $(this).data('role')
    if (role !== 'settings') return

    window.name = $('.auth-name').val();
    window.email = $('.auth-email').val();
    window.pass = $('.auth-password').val();
    window.subs = []

    $("#pt-auth-form input:checkbox:checked").each(function() {

      var sub = $(this).data('id')
      subs.push(sub)
    });


    var user = {
      name: name
    }
    var data = {
      'event': role,
      'user': user,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

  })



  $('body').on('click', '.pt-menu-logout', function() {

    var role = $(this).data('role')
    var data = {
      'event': role,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

  })


  //


  $('body').on('click', '.friend-request-btn, .friends-list-btn', function(e) {

    e.preventDefault()

    var role = $(this).data('role')
    var action = $(this).data('action')
    var friendId = $(this).data('id')

    if (action === 'accept' || action === 'reject') var method = 'PUT'
    else if (action === 'remove') var method = 'DELETE'

    var data = {
      'event': role,
      'action': action,
      'friendId': friendId,
      'method': method,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')
    return

  })


  //


  // $("body").on('submit', '#pt-auth-form', function(e) {

  //   e.preventDefault();

  //   var action = $(this).data('action')
  //   var data = {
  //     'action': action,
  //     'type': 'window'
  //   }

  //   console.log('iframe sent', data)
  //   window.parent.postMessage(data, '*')

  //   // var extensionId = 'malhbgmooogkoheilhpjnlimhmnmlpii'
  //   // chrome.runtime.sendMessage(extensionId, data, function(response){
  //   //   console.log('iframe recieved', response)
  //   // })

  // })

})


//


function changeSubmitButton(disable, replaceText, id) {
  if (!id) var btn = $("input[type='submit']")
  else var btn = $(id)

  if (replaceText) {
    if (!btn.val()) btn.html(replaceText)
    else btn.val(replaceText)
  }
  btn.attr('disabled', disable)
}