var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendSchema = new Schema({
  createdAt: Date,

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  friendOf: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],

  areCloseFriends: {
    type: Boolean,
    default: true
  }

})


friendSchema.methods.saveOtherFriend = function(next) {

  console.log('SAVE OTHER FRIEND')

  var Friend = require('models/friend/model')
  var self = this;
  var user = this.user
  var friendOf = this.friendOf

  var friend = Friend({
    user: friendOf,
    friendOf: user
  })

  friend.save(function(err, result) {

    console.log('SAVED')

    if (err) {
      console.log('couldnt create friend for other user', err)
      next(err)
    } else {
      console.log('created friend for other user', result)
      next()
    }

  })
}


friendSchema.methods.saveInUser = function(next){

  var self = this

  var User = require('models/user/model')

  User.findByIdAndUpdate(self.friendOf,{
    $push: {
      friends: self.user
    }
  }, function(err, doc){
    if (err){
      console.log(err)
    }
    else{
      console.log('UPDATED USER', self, doc)
    }
  })
}

friendSchema.post('save', function(next){
  this.saveInUser(next)
})
friendSchema.pre('remove', function(next) {

  var Friend = require('models/friend/model')
  var self = this;
  var friendOf = this.friendOf
  var userId = this.user

  Friend.findOne({
        'user': userId,
        'friendOf': friendOf
      }).exec(function(err, result) {

    if (err) {
      console.log('couldnt remove friend from other user', err)
      next(err)
    } else {
      console.log('removed friend from other user', result)
      next()
    }

  })

});

module.exports = friendSchema;