var mongoose = require('mongoose');
var postSchema = require('models/user/schema')

var Post = mongoose.model('Post', postSchema);


module.exports = Post;