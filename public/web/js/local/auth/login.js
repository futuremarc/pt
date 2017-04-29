$(document).ready(function() {

  window.changeSubmitButton = function(disable, replaceText, id) {
    if (!id) var btn = $("input[type='submit']")
    else var btn = $(id)

    if (replaceText) {
      if (!btn.val()) btn.html(replaceText)
      else btn.val(replaceText)
    }

    btn.attr('disabled', disable)
  }

})
$(document).ready(function() {

  var subsWrapper = $('#auth-subs-parent')
  var subs = JSON.parse(subscriptions)

  var html = Templates.auth.addSubs(subs)
  subsWrapper.html(html)

})