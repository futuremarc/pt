var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendSchema = new Schema({
  createdAt: Date,

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],

  isCloseFriend: {
    type: Boolean,
    default: true
  }

})


module.exports = friendSchema;