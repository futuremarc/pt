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


    $("body").on('submit', '#pt-auth-form', function(e) {

    e.preventDefault();

    var action = $(this).data('action')
    var data = {
      'action': action,
      'type':'external'
    }

    console.log('iframe sent', data)
    // parent.postMessage(data, '*')

    var extensionId = 'malhbgmooogkoheilhpjnlimhmnmlpii'
    chrome.runtime.sendMessage(extensionId, data, function(response){
      console.log('iframe recieved', response)
    })

  })



})