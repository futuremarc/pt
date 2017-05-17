$(document).ready(function() {


  if (loggedIn) {

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'https://passti.me/api/user/' + name,
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

          console.log(data)
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