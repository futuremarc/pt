var mongoose = require('mongoose')
var Schema = mongoose.Schema

var messageSchema = new Schema({
  content: String,
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    expires: 60 * 60 * 24,
    default: Date.now
  }

})

module.exports = messageSchema