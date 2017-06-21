var mongoose = require('mongoose')
var Schema = mongoose.Schema

var roomSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique:true
  },

  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],

  title: {
    type: String,
    required: true,
    unique:true
  },

  viewers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],

  isLive: {
    type: Boolean,
    default: false
  },

  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]

})


roomSchema.pre('save', function (next) {

var Room = require('models/room/model')

    var self = this;

    Room.find({title : self.title}, function (err, docs) {

        if (!docs.length){
            next();
        }else{       

            console.log('room exists: ',self.title);
            next('room exists!');
        }
    });
}) ;

module.exports = roomSchema