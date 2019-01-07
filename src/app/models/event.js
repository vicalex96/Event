const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: {type:String,required:true},
  creator: {type: Schema.Types.ObjectId, ref:"User"},
  career: {type:String},
  description: {type:String}
  //extension:{type:String, required:true}
});

module.exports = mongoose.model('Event', EventSchema);
