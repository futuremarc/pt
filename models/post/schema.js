var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({

  createdAt: {
    type: Date,
    expires: 60 * 60 * 24,
    default: Date.now
  }

  type: String,
  title: String,
  content: String,
  thumbnail: String,

  isLive: {
    type: Boolean,
    default: false
  },

  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  viewedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

})


module.exports = postSchema