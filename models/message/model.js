var mongoose = require('mongoose');
var messageSchema = require('models/message/schema');

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;