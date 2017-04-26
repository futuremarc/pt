var mongoose = require('mongoose');
var userSchema = require('models/user/schema')

var User = mongoose.model('User', userSchema);

module.exports = User;