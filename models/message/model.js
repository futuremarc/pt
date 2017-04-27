var mongoose = require('mongoose');
var messageSchema = require('models/user/schema');

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;