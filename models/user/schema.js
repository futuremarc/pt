var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  createdAt: Date,
  name: {
    required: true,
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  texture: String,
  model: Object,
  password: {
    required: true,
    type: String
  },
  friends: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    messages: [String],
    subscriptions: [String]
  }],
  following: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    messages: [String],
    subscriptions: [String]
  }],
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
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  subscriptions: [String],
  isLive: {
    type: Boolean,
    default: true
  },
  favoritePosts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

// METHODS

userSchema.pre('save', function(next) {
  // called on every save just before the object is saved
  var currentDate = new Date();
  var self = this
  var SALT_FACTOR = 5

  this.updatedAt = currentDate;

  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  if (!this.isModified('password')) return next();
  next()

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

  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {

    if (err) return cb(err);
    cb(null, isMatch);
  });
}


module.exports = userSchema;