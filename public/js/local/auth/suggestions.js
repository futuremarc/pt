$(document).ready(function() {

  if (loggedIn) { //from pug view

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/users/',
      success: function(data) {
        console.log(data)
        if (data.status === 'success') {

          var container = $('#auth-suggestions-parent')
          var users = data.data
          var html = Templates.auth.addSuggestions(users)
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