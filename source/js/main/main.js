$('document').ready(function() {

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

      default:

        var pos = data.user.position
        var rot = data.user.rotation

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
    },
    'login': function(data) {

      var action = data.action
      submitData(data, action)
    },
    'signup': function(data) {

      var action = data.action
      submitData(data, action)
    }
  }


  //

  function onWindowMsg(data) {

    console.log('iframe random msg', data)

    if (data.data.fromExtension) {

      console.log('iframe recieved from extension', data)

      var action = data.data.action
      var data = data.data

      windowMsgEvents[action](data)
    }
  }


  window.addEventListener("message", onWindowMsg, false);



  //


  $("body").on('submit', '#pt-auth-form', function(e) {
    console.log('SUBMIT FORM')
    e.preventDefault();

    var action = $(this).data('action')
    var name = $('.auth-name').val();
    window.email = $('.auth-email').val();
    window.pass = $('.auth-password').val();
    window.subs = []

    $("#pt-auth-form input:checkbox:checked").each(function() {

      var sub = $(this).data('id')
      subs.push(sub)
    });


    var action = $(this).data('action')
    var data = {
      'action': action,
      'name': name,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

  })



$('body').on('click', '.pt-menu-logout', function() {

    var action = $(this).data('action')
    var data = {
      'action': action,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

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