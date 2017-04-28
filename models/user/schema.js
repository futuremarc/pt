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
  followers: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    subscriptions: [{
      type: Schema.Types.ObjectId,
      ref: 'Subscription'
    }],
    isFriend: Boolean
  }],
  friendRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    subscriptions: [{
      type: Schema.Types.ObjectId,
      ref: 'Subscription'
    }],
    isFriend: Boolean
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
  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],
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


userSchema.pre('save', function(next) { // called before every document saved

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

  var self = this

  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    console.log('COMPARE PW', candidatePassword, self.password, err, isMatch)
    if (err) return cb(err);
    cb(null, isMatch);
  });
}


module.exports = userSchema;