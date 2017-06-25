var mongoose = require('mongoose');
var friendSchema = require('models/friend/schema')
var Friend = mongoose.model('Friend', friendSchema);

module.exports = Friend;