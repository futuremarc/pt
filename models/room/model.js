var mongoose = require('mongoose');
var roomSchema = require('models/room/schema');

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;