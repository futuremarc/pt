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

    var parentWindow = window.parent
    var action = $(this).data('action')

    parentWindow.postMessage({
      'event': action
    }, window.location.href)

  })


  //


  function submitData(data, event, cB) {

    var timeout = null
    var errorMessage = $('.error-message')
    var name = data.name

    console.log(data, event)

    if (event === 'settings') {

      errorMessage.html('&nbsp;')

      $.ajax({
        method: 'PUT',
        url: 'http://localhost:8080/api/user/' + name,
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            errorMessage.html(data.message + ' settings!')
            clearTimeout(timeout)

            timeout = setTimeout(function() {
              errorMessage.html('&nbsp;')
            }, 2000)
            if (cB) cB()

          } else {
            errorMessage.html(data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })

      return
    }


  }


  var windowMsgEvents = {

    'settings': function(data) {

      var event = arguments.callee.name //name of function is event
      var subs = []

      $("#pt-auth-form input:checkbox:checked").each(function() {

        var sub = $(this).data('id')
        subs.push(sub)
      });

      data.subscriptions = subs
      submitData(data, event)

    },
    'friend': function(data, e){

      var event = arguments.callee.name
      var name = $('.auth-name').val();
      var friendId = $(e).data('id')
      var userId = data._id
      
      submitData(data, event)

    }
  }


  //

  function onWindowMsg(e) {

    console.log('recieved', e)
    // if (e.origin !== window.parent.location) return;

    var event = e.data.event
    var data = e.data.data

    windowMsgEvents[event](data, e)
  }



  window.addEventListener("message", onWindowMsg, false);
})