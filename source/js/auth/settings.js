$(document).ready(function() {


  if (loggedIn) {

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/user/' + name,
      success: function(data) {
        console.log(data)
        if (data.status === 'success') {

          var mySubs = data.data.subscriptions
          var subs = JSON.parse(subscriptions) //from pug

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