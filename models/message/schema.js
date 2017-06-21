var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Room = require('models/room/model')

var messageSchema = new Schema({

  content: {
    type: String,
    required: true
  },

  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },

  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:true
  },
  // expires: 60 * 60 * 24,
  createdAt: {
    type: Date,
    default: Date.now
  }

})


messageSchema.methods.saveInRoom = function(roomId, cb){
  var self = this

  return Room.findByIdAndUpdate(roomId,{
    $push: {
      messages: self._id
    }
  }, cb)
}




messageSchema.pre('save', function(next) { // called before every document saved
  this.saveInRoom(this.room, next)
})





module.exports = messageSchema