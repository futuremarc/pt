function signInFromExtension(data) {

  var errorMessage = $(".error-message h3")
  var user = data
  var data = {
    email: user.email,
    password: user.password,
    name: user.name
  }

  $.ajax({
    method: 'POST',
    url: 'http://localhost:8080/api/login',
    data: data,
    success: function(data) {
      console.log(data)

      console.log('LOG IN', data)
      if (data.status === 'success') {

        errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')

        setTimeout(function() {
          location.href = '/'
        }, 0)

      } else {
        errorMessage.html(data.message)
      }
    },
    error: function(err) {
      console.log(err)
    }
  })
}


function initAuth() {

  $("body").on('submit', '#pt-auth-form', function(e) {

    e.preventDefault();

    var errorMessage = $(".error-message h3")
    var email = $('.auth-email').val();
    var pass = $('.auth-password').val();
    var name = $('.auth-name').val();
    var role = $(this).data('role')
    var subs = []
    var timeout = null

    $("#pt-auth-form input:checkbox:checked").each(function() {

      var sub = $(this).data('id')
      subs.push(sub)
    });

    if (role === 'settings') {

      return //clean this all up

      if (!isIframe)

        if (!isIframe) {

          myCharacter.data.subscriptions = subs

          putCharacter(function(data) {
            console.log(data)
            errorMessage.html(data.message + ' settings!')
            clearTimeout(timeout)

            timeout = setTimeout(function() {
              errorMessage.html('&nbsp;')
            }, 2000)

          })
        }

      errorMessage.html('&nbsp;')

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
      url: 'http://localhost:8080/api/' + role,
      data: data,
      success: function(data) {
        console.log(data)
        if (data.status === 'success') {

          errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
          if (!isIframe) {
            myCharacter.data = data.data
            putCharacter()
          }

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
}



var isIframe = window.parent !== window.self

if (!isIframe) initAuth()