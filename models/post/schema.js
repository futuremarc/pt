var mongoose = require('mongoose')
var Schema = mongoose.Schema

var postSchema = new Schema({

  //expires: 60 * 60 * 24,
  createdAt: {
    type: Date,
    default: Date.now
  },

  type: String,
  title: String,
  url: String,
  thumbnail: String,
  timestamp: Number,

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