$(document).ready(function() {



  function changeSubmitButton(disable, replaceText, id) {
    if (!id) var btn = $("input[type='submit']")
    else var btn = $(id)

    if (replaceText) {
      if (!btn.val()) btn.html(replaceText)
      else btn.val(replaceText)
    }

    btn.attr('disabled', disable)
  }



  $('body').on('keyup', '#pt-friend-form', function(e) {

    if (e.keyCode === 13) return

    var errorMessage = $(".error-message h3")
    var name = $(this).find('input').val()
    var timeout = null

    clearTimeout(timeout)
    errorMessage.html('searching...')

    var self = this

    $.ajax({
      method: 'GET',
      url: 'http://localhost:8080/api/user/' + name,
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



  $("body").on('submit', '#pt-friend-form', function(e) {

    e.preventDefault();

    var action = $(this).data('action')
    var friendId = $(this).data('id')

    var data = {
      'friendId': friendId,
      'type':'external'
    }

    var extensionId = 'malhbgmooogkoheilhpjnlimhmnmlpii'
    chrome.runtime.sendMessage(extensionId, data, function(response){
      console.log('got response', response)
    })

    // parent.postMessage({
    //   data: data,
    //   action: action
    // }, window.location.href)

  })


})