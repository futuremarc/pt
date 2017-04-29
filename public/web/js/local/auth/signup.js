$(document).ready(function() {

  var subsWrapper = $('#auth-subs-parent')
  var subs = JSON.parse(subscriptions)

  var html = Templates.auth.addSubs(subs)
  subsWrapper.html(html)

})