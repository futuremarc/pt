Handlebars.registerHelper('upper', function(str) {
	return str.toUpperCase()
});

Handlebars.registerHelper('firstUpper', function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

Handlebars.registerHelper('formatDate', function(date){
	return moment(date).format('MM/DD/YYYY HH:mm')
})

Handlebars.registerHelper('formatTime', function(date){
	return moment(date).format('HH:mm')
})

Handlebars.registerHelper('getLength', function (obj) {
 return obj.length;
});

Handlebars.registerHelper('ifCond', function (a, operator, b, options) {

	switch (operator) {
	    case '==':
	        return (a == b) ? options.fn(this) : options.inverse(this);
	    case '===':
	        return (a === b) ? options.fn(this) : options.inverse(this);
	    case '!=':
	        return (a != b) ? options.fn(this) : options.inverse(this);
	    case '!==':
	        return (a !== b) ? options.fn(this) : options.inverse(this);
	    case '<':
	        return (a < b) ? options.fn(this) : options.inverse(this);
	    case '<=':
	        return (a <= b) ? options.fn(this) : options.inverse(this);
	    case '>':
	        return (a > b) ? options.fn(this) : options.inverse(this);
	    case '>=':
	        return (a >= b) ? options.fn(this) : options.inverse(this);
	    case '&&':
	        return (a && b) ? options.fn(this) : options.inverse(this);
	    case '||':
	        return (a || b) ? options.fn(this) : options.inverse(this);
	    default:
	        return options.inverse(this);
	}
});

Handlebars.registerHelper('ifEqual', function(a,b, opts){
	if(a==b){
		return opts.fn(this)
	}
	else {
		return opts.inverse(this)
	}
})

Handlebars.registerHelper('ifNotEqual', function(a,b, opts){
	if(a!=b){
		return opts.fn(this)
	}
	else {
		return opts.inverse(this)
	}
})

Handlebars.registerHelper('ifIn', function(a,b,opts){
	if(b.indexOf(a) > -1){
		return opts.fn(this)
	}
	else {
		return opts.inverse(this)
	}
})

Handlebars.registerHelper('ifHasPast', function(date, opts){
	if(moment(date).isAfter(moment())){
		return opts.inverse(this)
	} else {
		return opts.fn(this)
	}
})

Handlebars.registerHelper('eachSlice', function(array, opts){

	var slice = 10
	var s = ''

	if(array.length<10){
		slice = array.length
	}
	
	for(var i=array.length-1; i>=array.length-slice;i--){
		s+=opts.fn(array[i])
	}

	return s;
})
$('document').ready(function() {


  var isIframe = (window.parent !== window.self)

  window.myCharacter = {}

  var submitData = {

    'initAuth': function(data) {

      console.log('iframe initAuth', data)
      myCharacter.data = data.user

      var role = data.role
      var roomId = data.room

      if (role === 'room') initRoom(roomId)

    },

    'feedback': function(data) {

      var errorMessage = $('.error-message h3')
      var event = data.event
      var userName = data.user.name
      var feedback = $('textarea').val()

      if (!feedback) return

      data = {
        userName: userName,
        feedback: feedback
      }

      $.ajax({
        method: 'POST',
        url: 'https://passti.me/api/feedback/', // + event
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            //errorMessage.html(data.message + '!')
            changeSubmitButton(true, data.message + '!')

          } else {
            errorMessage.html(data.message)
            changeSubmitButton(true)
          }

        },
        error: function(err) {
          console.log(err)
        }
      })

    },

    'suggestion': function(data) {

      var event = data.event
      var action = data.action
      var userId = data.user._id
      var friendId = data.friendId

      data = {
        userId: userId,
        action: action
      }

      $.ajax({
        method: 'POST',
        url: 'https://passti.me/api/users/friends/' + friendId, // + event
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            var user = data.data
            myCharacter.data = user
            var elt = $("[data-id='" + friendId + "']")[0]

            changeSubmitButton(true, 'Request sent!', false, elt)

          } else {
            changeSubmitButton(true, data.message, false, elt)
          }

          data = {
            'event': 'update',
            'type': 'window',
            'user': user
          }
          window.parent.postMessage(data, '*')

        },
        error: function(err) {
          console.log(err)
        }
      })
    },


    'friend': function(data) {

      var errorMessage = $('.error-message h3')
      var event = data.event
      var action = data.action
      var userId = data.user._id
      var friendId = data.friendId

      data = {
        userId: userId,
        action: action
      }

      $.ajax({
        method: 'POST',
        url: 'https://passti.me/api/users/friends/' + friendId, // + event
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            var user = data.data
            myCharacter.data = user

            errorMessage.html(data.message + '!')
            changeSubmitButton(true)

          } else {
            errorMessage.html(data.message)
            changeSubmitButton(true)
          }

          data = {
            'event': 'update',
            'type': 'window',
            'user': user
          }
          window.parent.postMessage(data, '*')

        },
        error: function(err) {
          console.log(err)
        }
      })
    },

    'request': function(data) {
      console.log('iframe recieved', data)

      var timeout = null
      var errorMessage = $('.error-message h3')
      var event = data.event
      var action = data.action
      var userId = data.user._id
      var friendId = data.friendId

      if (action === 'accept' || action === 'reject') var method = 'PUT'
      else if (action === 'remove') var method = 'DELETE'


      data = {
        userId: userId,
        action: action
      }

      var self = this

      $.ajax({
        method: method,
        url: 'https://passti.me/api/users/friends/' + friendId, //+ event,
        data: data,
        success: function(data) {
          console.log(data)

          var user = data.data

          var container = $('#friend-requests-parent')
          var html = Templates.auth.addFriendRequests(user.friendRequests)
          container.html(html)

          var container = $('#friends-list-parent')
          var html = Templates.auth.addFriendsList(user.friends)
          container.html(html)

          data = {
            'event': 'update',
            'type': 'window',
            'user': user
          }

          window.parent.postMessage(data, '*')

        },
        error: function(data) {
          console.log(data)
        }
      })

    },

    'settings': function(data) {

      var timeout = null
      var errorMessage = $('.error-message h3')
      var event = data.event
      var userId = data.user._id
      var name = data.user.name

      var subs = []
      $("#pt-auth-form input:checkbox:checked").each(function() {
        var sub = $(this).data('id')
        subs.push(sub)
      });
      data.subscriptions = subs

      $.ajax({
        method: 'PUT',
        url: 'https://passti.me/api/users/' + name,
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            clearTimeout(timeout)
            timeout = setTimeout(function() {
              changeSubmitButton(false, 'Update')
            }, 1000)

            changeSubmitButton(true, data.message + ' settings!')

            data = {
              'event': 'update',
              'type': 'window',
              'user': data.data
            }

            window.parent.postMessage(data, '*')

          } else {
            changeSubmitButton(true, data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })
    },
    login: function(data) {
      if (isIframe) this['default'](data)
    },
    signup: function(data) {
      if (isIframe) this['default'](data)
    },
    default: function(data) {


      //not in use
      var timeout = null
      var errorMessage = $('.error-message h3')
      var pos = data.user.position
      var rot = data.user.rotation
      var event = data.event
      var userId = data.user._id

      data = {
        email: email,
        password: pass,
        name: name,
        position: pos,
        rotation: rot,
        subscriptions: subs
      }

      console.log('signup/login', data)

      $.ajax({
        method: 'POST',
        url: 'https://passti.me/api/' + event,
        data: data,
        success: function(data) {
          console.log(data)
          if (data.status === 'success') {

            errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')

            location.href = '/'

            return

            data = {
              'event': 'refreshPage',
              'name': name,
              'user': data.data,
              'type': 'window'
            }

            console.log('iframe sent', data)
            window.parent.postMessage(data, '*')

          } else {
            errorMessage.html(data.message)
          }
        },
        error: function(err) {
          console.log(err)
        }
      })

    }
  }


  //

  function onWindowMsg(data) {

    console.log('iframe random msg', data)

    if (data.data.fromExtension) {

      console.log('iframe recieved from extension', data)

      var event = data.data.event
      data = data.data

      submitData[event](data)

    }
  }


  window.addEventListener("message", onWindowMsg, false);

 $("body").on('submit', '#pt-auth-form', function(e) {
    e.preventDefault();

    var role = $(this).parents('.pt-auth-container').data('role')
      //if (role !== 'settings') return

    window.name = $('.auth-name').val();
    window.email = $('.auth-email').val();
    window.pass = $('.auth-password').val();
    window.subs = []

    $("#pt-auth-form input:checkbox:checked").each(function() {

      var sub = $(this).data('id')
      subs.push(sub)
    });


    var user = {
      name: name
    }
    var data = {
      'event': role,
      'user': user,
      'type': 'window'
    }

    console.log('iframe sent', data)
    if (isIframe) window.parent.postMessage(data, '*')

  })



  $("body").on('submit', '#pt-feedback-form', function(e) {
    e.preventDefault();

    var role = $(this).parents('.pt-auth-container').data('role')

    var data = {
      'event': role,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

  })


  $('body').on('keyup', '#pt-feedback-form', function(e) {

    if (e.keyCode === 13) return

    var errorMessage = $(".error-message h3")
    var feedback = $(this).find('textarea').val()

    if (feedback) changeSubmitButton(false)
    else changeSubmitButton(true)

  })



  $('body').on('click', '.pt-menu-logout', function() {

    var role = $(this).data('role')
    var data = {
      'event': role,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')

  })


  //


  $('body').on('click', '.friend-request-btn, .friends-list-btn', function(e) {

    e.preventDefault()

    var role = $(this).data('role')
    var action = $(this).data('action')
    var friendId = $(this).data('id')

    //if i accept friend request, get otehr guys info and 'join'

    var data = {
      'event': role,
      'action': action,
      'friendId': friendId,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')
    return

  })


  //


  $('body').on('click', '.suggested-friend-btn', function(e) {

    e.preventDefault()

    var role = $(this).data('role')
    var action = $(this).data('action')
    var friendId = $(this).data('id')

    var data = {
      'event': role,
      'action': action,
      'friendId': friendId,
      'type': 'window'
    }

    console.log('iframe sent', data)
    window.parent.postMessage(data, '*')
    return

  })


  //


  $('body').on('keyup', '#pt-friend-form', function(e) {

    if (e.keyCode === 13) return

    var errorMessage = $(".error-message h3")
    var name = $(this).find('input').val().toLowerCase()
    var timeout = null

    if (!name) return

    clearTimeout(timeout)
    errorMessage.html('searching...')

    var friends = myCharacter.data.friends
    var friendExists = false

    friends.some(function(friend) {
      if (friend.user.name === name) {

        friendExists = true
        return friend

      }
    })

    if (friendExists) {

      errorMessage.html('<b>' + name + '</b> is already your friend')
      changeSubmitButton(true, 'Add friend')

      return
    } else if (name === myCharacter.data.name) {
      errorMessage.html('... that\'s you...')
      changeSubmitButton(true, 'Add friend')

      return
    } else changeSubmitButton()

    var self = this

    $.ajax({
      method: 'GET',
      url: 'https://passti.me/api/users/' + name,
      success: function(data) {
        console.log(data)

        clearTimeout(timeout)

        if (data.status === 'success') {

          if (data.data) errorMessage.html(data.message + ' <strong>' + data.data.name + '</strong>!')
          $(self).data('id', data.data._id)
          changeSubmitButton(false)

        } else if (data.status === 'not found') {
          changeSubmitButton(true)
            // timeout = setTimeout(function() {
            //   errorMessage.html('&nbsp;')
            // }, 2000)
        } else if (data.status === 'error') {
          errorMessage.html(data.message)
          changeSubmitButton(true)
        }
      },
      error: function(err) {
        console.log(err)
      }
    })
  })


  //


  $("body").on('submit', '#pt-friend-form', function(e) {

    e.preventDefault();

    var role = $(this).parents('.pt-auth-container').data('role')
    var friendId = $(this).data('id')
    var userId = myCharacter.data._id

    var data = {
      'friendId': friendId,
      'type': 'window',
      'event': role
    }

    window.parent.postMessage(data, '*')

  })


  var role = $('.pt-page').data('role')
  var data = {
    'event': 'initAuth',
    'role': role,
    'type': 'window'
  }

  if (isIframe) window.parent.postMessage(data, '*')

})