var mongoose = require('mongoose');
var subSchema = require('models/subscription/schema');

var Subscription = mongoose.model('Subscription', subSchema);

module.exports = Subscription;