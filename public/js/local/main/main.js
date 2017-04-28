$('document').ready(function() {

  if (loggedIn) {

    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/user/' + name,
      success: function(data) {
        console.log(data)
        if (data.status === 'success') {

          var requestsWrapper = $('#friend-requests-parent')

          var reqs = data.data.friendRequests
          var html = Templates.auth.addFriendRequests(reqs)
          requestsWrapper.html(html)

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