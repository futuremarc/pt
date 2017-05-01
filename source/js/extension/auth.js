$("body").on('submit', '#pt-auth-form', function(e) {


  e.preventDefault();

  var errorMessage = $(".error-message h3")

  var email = $('.auth-email').val();
  var pass = $('.auth-password').val();
  var name = $('.auth-name').val();
  var action = $(this).data('action')
  var subs = []
  var timeout = null


  $("#pt-auth-form input:checkbox:checked").each(function() {

    var sub = $(this).data('id')
    subs.push(sub)
  });

  if (action === 'settings') {

    errorMessage.html('&nbsp;')

    var data = {
      subscriptions: subs
    }

    putCharacter(data, function(data) {

      console.log(data)

      errorMessage.html(data.message + ' settings!')
      clearTimeout(timeout)

      timeout = setTimeout(function() {
        errorMessage.html('&nbsp;')
      }, 2000)

    })

    return
  }


  var pos = getCharacterPos()
  var rot = getCharacterRot()

  var data = {
    email: email,
    password: pass,
    name: name,
    position: pos,
    rotation: rot,
    subscriptions: subs
  }


  $.ajax({
    method: 'POST',
    url: 'http://localhost:8080/api/' + action,
    data: data,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
        myCharacter.data = data.data

        putCharacter()

        setTimeout(function() {
          location.href = '/'
        }, 500)

      } else {
        errorMessage.html(data.message)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })
})


$("body").on('submit', '#pt-friend-form', function(e) {

  e.preventDefault();

  var errorMessage = $(".error-message h3")

  var name = $('.auth-name').val();
  var userId = myCharacter.data._id
  var friendId = $(this).data('id')
  var action = $(this).data('action')

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

      } else {
        errorMessage.html(data.message)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })
})



$('body').on('keyup', '#pt-friend-form', function(e) {

  var timeout = null

  if (e.keyCode === 13) return

  var errorMessage = $(".error-message h3")
  var name = $(this).find('input').val()

  clearTimeout(timeout)
  errorMessage.html('searching...')

  var self = this

  $.ajax({
    method: 'GET',
    url: 'http://localhost:8080/api/user/' + name,
    success: function(data) {
      console.log(data)
      if (data.status === 'success') {

        if (data.data) errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
        $(self).data('id', data.data._id)
        changeSubmitButton(false)

      } else if (data.status === 'not found') {
        changeSubmitButton(true)
        timeout = setTimeout(function() {
          errorMessage.html('&nbsp;')
        }, 2000)
      } else if (data.status === 'error') {
        errorMessage.html(data.message)
        changeSubmitButton(true)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })


})

$('body').on('click', '.friend-request-btn, .friends-list-btn', function(e) {

  e.preventDefault()

  var friendId = $(this).data('id')
  var userId = myCharacter.data._id
  var purpose = $(this).data('purpose')
  var action = $(this).data('action')
  if (action === 'accept' || action === 'reject') var method = 'PUT'
  else if (action === 'remove') var method = 'DELETE'

  var data = {
    friendId: friendId,
    userId: userId
  }

  var self = this

  $.ajax({
    method: method,
    url: 'http://localhost:8080/api/user/friend/' + action,
    data: data,
    success: function(data) {
      console.log(data)

      //if (data.status === 'success') $(self).parentsUntil(1).closest('li').remove()

      var container = $('#friend-requests-parent')
      var reqs = data.data.friendRequests
      var html = Templates.auth.addFriendRequests(reqs)
      container.html(html)

      var container = $('#friends-list-parent')
      var friends = data.data.friends
      var html = Templates.auth.addFriendsList(friends)
      container.html(html)

    },
    error: function(data) {
      console.log(data)
    }
  })
})


$('body').on('click', '#logout', function() {
  chrome.storage.sync.set({
    'pt-user': {}
  }, function() {
    window.location.href = 'http://localhost:8080/logout'
  })
})
