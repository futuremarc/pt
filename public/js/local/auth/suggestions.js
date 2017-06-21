$(document).ready(function() {

  if (loggedIn) { //from pug view

    var errorMessage = $(".error-message h3")


    $.ajax({
      method: 'GET',
      url: 'https://passti.me/api/users/' + _id,
      success: function(data) {
        console.log(data)

        if (data.status === 'success') {

          var friends = data.data.friends

          $.ajax({
            method: 'GET',
            url: 'https://passti.me/api/users/',
            success: function(data) {
              console.log(data)
              if (data.status === 'success') {

                var container = $('#auth-suggestions-parent')
                var users = data.data
                var usersToShow = []

                users.forEach(function(user) {

                  var isUserFriend = false

                  friends.forEach(function(friend) {
                    if (user._id === friend.user._id) isUserFriend = true
                   
                  })

                  var isMe = (_id === user._id)
                  var isRequestAlreadySent = (user.friendRequests.indexOf(_id) > -1)

                  if (!isUserFriend && !isMe && !isRequestAlreadySent) usersToShow.push(user)

                })

                var html = Templates.auth.addSuggestions(usersToShow)
                container.html(html)

              } else {
                errorMessage.html(data.message)
              }
            },
            error: function(err) {
              console.log(err)
            }
          })


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