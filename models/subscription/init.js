var Subscription = require('models/subscription/model')

module.exports = function() {

  var subscriptions = []

  var sub = new Subscription({
    title: "SoundCloud",
    type: "music"
  })

  subscriptions.push(sub)

  var sub = new Subscription({
    title: "Spotify",
    type: "music"
  })

  subscriptions.push(sub)

  var sub = new Subscription({
    title: "YouTube",
    type: "video"
  })

  subscriptions.push(sub)

  var sub = new Subscription({
    title: "Wikipedia",
    type: "article"
  })

  subscriptions.push(sub)

  var sub = new Subscription({
    title: "NY Times",
    type: "article"
  })

  subscriptions.push(sub)

  subscriptions.forEach(function(sub) {
    sub.save(function(err, doc) {
      if (err) {
        if (err.code == '11000') {
          console.log(sub.title, "subscription exists in db")
          return
        } else {
          throw err
        }
      }else{
        console.log(sub.title, "subscription added to db!")
      }
    })
  })

  return 
}