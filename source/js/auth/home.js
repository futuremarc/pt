$(document).ready(function(){

  var isIframe = window.parent !== window.self

 if (loggedIn && isIframe) {


    var errorMessage = $(".error-message h3")

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/user/' + name,
      success: function(data) {
        console.log(data)

        if (data.status === 'success') {

          var container = $('#friend-requests-parent')
          var reqs = data.data.friendRequests
          var html = Templates.auth.addFriendRequests(reqs)
          container.html(html)

          var container = $('#friends-list-parent')
          var friends = data.data.friends
          var html = Templates.auth.addFriendsList(friends)
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
 