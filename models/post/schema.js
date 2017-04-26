var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Scene = require('models/scene/model')

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
  createdAt: {
    type: Date,
    expires: 60 * 60 * 12,
    default: Date.now
  }

})

tagSchema.methods.saveInScene = function(sceneId, cb) {

  var self = this

  return Scene.findByIdAndUpdate(sceneId, {
    $push: {
      tags: self._id
    }
  }, cb)

}


module.exports = tagSchema