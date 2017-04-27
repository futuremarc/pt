var mongoose = require('mongoose')
var Schema = mongoose.Schema

var subSchema = new Schema({
 title: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    unique: true
  },
  description: String
})


module.exports = subSchema