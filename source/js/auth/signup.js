$(document).ready(function() {

  $("body").on('submit', '#auth-form', function(e) {

    e.preventDefault();

    var errorMessage = $(".error-message h3")

    var email = $('.auth-email').val();
    var password = $('.auth-password').val();
    var name = $('.auth-name').val();
    var type = $(this).data('name')

    var data = {
      email: email,
      password: password,
      name: name
    }

    $.ajax({
      method: 'POST',
      url: '/api/' + type,
      data: data,
      success: function(data) {
        console.log(data)
        if (data.status !== 'success') {
          errorMessage.html(data.message)
        } else {
          errorMessage.html('')
        }
      },
      error: function(err) {
        console.log(err)
      }
    })
  })

})