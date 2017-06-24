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
  url: {
    type: String,
    required: true
  },
  thumbnail: String,
  timestamp: Number,

  isLive: {
    type: Boolean,
    default: true
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
    ref: 'User',
    required: true
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },

})

postSchema.methods.saveInRoom = function(roomId, cb){
  var self = this

  var Room = require('models/room/model')

  return Room.findByIdAndUpdate(roomId,{
    $push: {
      posts: self._id
    }
  }, cb)
}




postSchema.pre('save', function(next) { // called before every document saved
  this.saveInRoom(this.room, next)
})



module.exports = postSchema