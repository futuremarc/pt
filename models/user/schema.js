var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  createdAt: Date,

  name: {
    required: true,
    unique: true,
    type: String
  },

  email: {
    type: String,
    unique: true,
    trim: true
  },

  password: {
    required: true,
    type: String
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room'
  },

  texture: String,
  model: Object,
  action: String,

  position: {
    x: Number,
    y: Number,
    z: Number
  },

  rotation: {
    x: Number,
    y: Number,
    z: Number
  },

  friends: [{
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
  }],

  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique:true
  }],

  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],

  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],
  isLive: {
    type: Boolean,
    default: false
  },
  favoritePosts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
})


userSchema.pre('save', function(next) { // called before every document saved

  var currentDate = new Date();
  var self = this
  var SALT_FACTOR = 5

  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err)

    bcrypt.hash(self.password, salt, null, function(err, hash) {
      if (err) return next(err);

      self.password = hash

      next()
    })
  })

})

userSchema.methods.comparePassword = function(candidatePassword, cb) {

  var self = this

  if (this.password === candidatePassword) {
    var isMatch = true
    cb(null, isMatch);
    return
  }
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}




userSchema.methods.createRoom = function(next) {

  var Room = require('models/room/model')

  var userId = this._id
  var title = this.name

  var self = this

  var room = Room({
    user: userId,
    title: title
  })

  room.save(function(err, result) {

    if (err) {
      console.log('cant save room on new user', err)
      next(err)
    } else {
      console.log('saved room on new user', result)
      self.room = result._id

      next()
    }

  })

}



module.exports = userSchema;