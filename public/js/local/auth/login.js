$(document).ready(function() {
  var subsWrapper = $('#auth-subs-container')
  var subs = JSON.parse(subscriptions)

  var html = Templates.auth.addSubs(subs)
  subsWrapper.append(html)

})