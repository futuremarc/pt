$(document).ready(function() {

  if (loggedIn) { //from pug view

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'https://passti.me/api/users/',
      success: function(data) {
        console.log(data)
        if (data.status === 'success') {

          var container = $('#auth-suggestions-parent')
          var users = data.data
          var html = Templates.auth.addFriendsList(users)
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


})