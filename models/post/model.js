var mongoose = require('mongoose');
var postSchema = require('models/post/schema');

var Post = mongoose.model('Post', postSchema);

module.exports = Post;