$(document).ready(function() {

  var subsWrapper = $('#auth-subs-parent')
  var subs = JSON.parse(subscriptions) //from pug

  var html = Templates.auth.addSubscriptions({subscriptions : subs})
  subsWrapper.html(html)

})