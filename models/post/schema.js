var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: String,
  content: String,
  title: String,
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
  thumbnail: String,
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24,
    default: Date.now
  }

})


module.exports = postSchema