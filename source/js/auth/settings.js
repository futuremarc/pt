$(document).ready(function() {

  if (isLoggedIn) { //from pug view

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/users/' + window.userName,
      success: function(data) {
        console.log(data)
        if (data.status === 'success') {

          var mySubs = data.data.subscriptions
          var subs = JSON.parse(subscriptions) //from pug view

          var subsWrapper = $('#auth-subs-parent')

          var data = {
            subscriptions: subs,
            mySubscriptions: mySubs
          }

          var html = Templates.auth.addSubscriptions(data)
          subsWrapper.html(html)

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